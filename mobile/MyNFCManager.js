import NfcManager, {Ndef, NfcTech} from "react-native-nfc-manager";
import Toast from 'react-native-root-toast';

const MyNFCManager = {
    writeSheet: async function (stringData) {
        let result = false;
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
            }
        } catch (e) {
            // console.warn("NFC error: ", e);
            Toast.show('Réponse mock, mais voici l\'erreur : ' + e, {
                duration: Toast.durations.LONG,
            });
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
