import NfcManager, {Ndef, NfcTech} from "react-native-nfc-manager";
import Toast from 'react-native-root-toast';

NfcManager.start();

const MyNFCManager = {
    isNFCActive: async function () {
        const isSupported = await NfcManager.isSupported();
        if (!isSupported) {
            Toast.show("NFC non supporté", {
                duration: Toast.durations.LONG,
            });
            return false;
        }
        const isEnabled = await NfcManager.isEnabled();
        if (!isEnabled) {
            //TODO: ask for NFC permission with goToNfcSetting() for Android
            Toast.show("NFC désactivé, veuillez l'activer", {
                duration: Toast.durations.LONG,
            });
            return false;
        }
        return true;
    },
    readSheet : async function () {
        let sheet = null;
        try {
            // register for the NFC tag with NDEF in it
            await NfcManager.requestTechnology(NfcTech.Ndef);
            // the resolved tag object will contain `ndefMessage` property
            const tag = await NfcManager.getTag();
            console.log('Tag : ', tag);
            const payload = tag.ndefMessage[0].payload.slice(3);
            Toast.show("Feuille récupérée!", {
                duration: Toast.durations.LONG,
            });
            console.log('Sheet read : ', String.fromCharCode(...payload));
            sheet = JSON.parse(String.fromCharCode(...payload));
        } catch (ex) {
            Toast.show("Oops, erreur de lecture!", {
                duration: Toast.durations.LONG,
            });
            console.log('Error : ', ex);
        } finally {
            // stop the nfc scanning
            await NfcManager.cancelTechnologyRequest();
        }
        return sheet;
    },
    writeSheet: async function (sheet) {
        let result = false;
        //STEP 0
        const isNFCActive = await this.isNFCActive();
        if (!isNFCActive) {
            return result;
        }
        try {
            // STEP 1
            //Need to request Ndef technology before writing on NFC tag
            await NfcManager.requestTechnology(NfcTech.Ndef);
            const bytes = Ndef.encodeMessage([Ndef.textRecord(JSON.stringify(sheet))]); // STEP 1
            if (bytes) {
                await NfcManager.ndefHandler // STEP 2
                    .writeNdefMessage(bytes); // STEP 3
                console.log('Data written on NFC tag');
                result = true;
                Toast.show("Feuille écrite sur le tag NFC", {
                    duration: Toast.durations.LONG,
                });
                console.log("Sheet written on NFC tag");
            }
        } catch (e) {
            //Return empty error when we cancel the NFC request, so we don't want to show the error
            if (e.toString() === "Error: java.io.IOException") {
                Toast.show("Ecriture incomplète, veuillez attendre la confirmation avant de retirer le téléphone du tag", {
                    duration: Toast.durations.LONG,
                });
                console.log("NFC writing incomplete");
            } else if (!(e.toString() === "Error")) {
                Toast.show("Erreur d'écriture", {
                    duration: Toast.durations.LONG,
                });
                console.log("NFC write error -> ", e);
            }
            throw e;
        } finally {
            // STEP 4
            await NfcManager.cancelTechnologyRequest();
        }

        return result;
    },
    cancelNfcRequest : async function () {
            await NfcManager.cancelTechnologyRequest();
    }
}

export default MyNFCManager;
