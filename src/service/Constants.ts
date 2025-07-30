// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Alert } from 'react-native';

// interface AppSettings {
//     getUrl: () => Promise<string>;
//     BASE_URL: () => Promise<string>;
//     // AUTH_URL: () => Promise<string>;
// }

// const getUrlFromStorage = async (): Promise<string> => {
//     try {
//         const val = await AsyncStorage.getItem('selectenv');
//         let currentURL = 'https://gearforneed.com/'; // Default URL

//         if (val === 'deve') {
//             currentURL = 'https://devpng.gearforneed.com/';
//         } else if (val === 'val') {
//             currentURL = 'https://valpng.gearforneed.com/';
//         }
//         console.log('currentURL',currentURL)
//         return currentURL;
//     } catch (error) {
//         console.error('Error retrieving environment setting:', error);
//         return 'https://gearforneed.com/'; // Fallback URL
//     }
// };

// const AppSettings: AppSettings = {
//     getUrl: async () => {
//         const url = await getUrlFromStorage();
//         return url;
//     },
//     BASE_URL: async () => {
//         return await AppSettings.getUrl();
//     },

//     // AUTH_URL: async ()=>  {

//     //     return 'https://jwtauth.jwtechinc.com/';
//     // }
// };

// export default AppSettings;
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AppSettings {
    getUrl: () => Promise<string>;
    BASE_URL: () => Promise<string>;
}

const getUrlFromStorage = async (): Promise<string> => {
    try {
        const val = await AsyncStorage.getItem('selectenv');
        console.log(' val',val)
        let currentURL = 'https://rapi.dinkhoo.com/';

        if (val === 'deve') {
            currentURL = 'https://devrapi.dinkhoo.com/';
        } else if (val === 'val') {
            currentURL = 'https://valrapi.dinkhoo.com/'
        }
        console.log('currentURL',currentURL)
        AsyncStorage.setItem('currentURL',currentURL)
        return currentURL;
    } catch (error) {
        console.error('Error retrieving environment setting:', error);
        return 'https://rapi.dinkhoo.com/'; 
    }
    // let currentURL = 'https://rythuvani.dinkhoo.com/';
    // console.log('currentURL', currentURL)
    // AsyncStorage.setItem('currentURL', currentURL)
    // return currentURL;
};

const AppSettings: AppSettings = {
    getUrl: async () => {
        const url = await getUrlFromStorage();
        return url;
    },
    BASE_URL: async () => {
        return await AppSettings.getUrl();
    },
};

export default AppSettings;

