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
    writeSheet: async function (stringData) {
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
            const bytes = Ndef.encodeMessage([Ndef.textRecord(stringData)]);
            if (bytes) {
                await NfcManager.ndefHandler // STEP 2
                    .writeNdefMessage(bytes); // STEP 3
                result = true;
                Toast.show("Feuille écrite sur le tag NFC", {
                    duration: Toast.durations.LONG,
                });
                console.log("Feuille écrite sur le tag NFC");
            }
        } catch (e) {
            //Return empty error when we cancel the NFC request, so we don't want to show the error
            if(!(e.toString() === "Error")){
                Toast.show("Erreur d'écriture", {
                    duration: Toast.durations.LONG,
                });
                console.log("NFC write error -> ", e);
            }
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
