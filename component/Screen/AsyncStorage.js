import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async (keyName, value) => {

    return new Promise(async (resolve, reject) => {
        try {
            const jsonValue = JSON.stringify(value)
            await AsyncStorage.setItem(keyName, jsonValue);
            return resolve({ status: true })
        } catch (e) {
            return resolve({ status: false })
        }
    })


}

export const getData = async (keyName) => {
    return new Promise(async (resolve, reject) => {
        try {
            const value = await AsyncStorage.getItem(keyName)
            if (value !== null) {
                return resolve({ status: true, [keyName]: JSON.parse(value) })
                // value previously stored
            } else {
                return resolve({ status: false, [keyName]: JSON.parse(value) })
            }
        } catch (e) {
            return resolve({ status: false })

            // error reading value
        }
    })
}