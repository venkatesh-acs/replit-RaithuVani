// import AppSettings from "./Constants";
// import axios from "axios";
// export const LoginService = {
//     async getData(apiname: any, data: any) {
//         const rep = await fetch(`${AppSettings.BASE_URL()}${apiname}`, {
//             method: "POST",
//             body: JSON.stringify(data),
//             headers: {
//                 'Content-Type': 'application/x-www-form-urlencoded',
//             },
//         });
//         const json = await rep.json();

//         return json;
//     },
//     async getDatas(apiname: any, data: any): Promise<any> {
//         try {
//             const apiUrl = `${AppSettings.BASE_URL()}${apiname}`;
//             const response = await axios.post(apiUrl, data, {
//                 headers: {
//                     'Content-Type': 'application/x-www-form-urlencoded',
//                 },
//             });
//             return response.data;
//         } catch (error) {
//             console.error(`Error fetching data from ${apiname}`, error);
//             throw error;
//         }
//     },
//     async uploadimage(apiname: any, formdata: any): Promise<any> {
//         try {
//           const apiUrl = `${AppSettings.BASE_URL()}${apiname}`;
//           const response = await axios.post(apiUrl, formdata, {
//             headers: {
    
//               'Content-Type': 'multipart/form-data',
//             },
//           });
//           return response.data;
//         } catch (error) {
//           console.error(`Error fetching data from ${apiname}`, error);
//           throw error;
//         }
//       },
// }
import AppSettings from "./Constants";
import axios from "axios";

export const LoginService = {
    async getData(apiname: string, data: any) {
        try {
            const baseUrl = await AppSettings.BASE_URL();
            const response = await fetch(`${baseUrl}${apiname}`, {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const json = await response.json();
            return json;
        } catch (error) {
            console.error(`Error fetching data from ${apiname}`, error);
            throw error;
        }
    },

    async getDatas(apiname: string, data: any): Promise<any> {
        try {
            const baseUrl = await AppSettings.BASE_URL();
            const response = await axios.post(`${baseUrl}${apiname}`, data, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching data from ${apiname}`, error);
            throw error;
        }
    },

    async uploadimage(apiname: string, formdata: FormData): Promise<any> {
        try {
            const baseUrl = await AppSettings.BASE_URL();
            const response = await axios.post(`${baseUrl}${apiname}`, formdata, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Error uploading image to ${apiname}`, error);
            throw error;
        }
    },
    async getauthcode(apiname: string, data: any): Promise<any> {
        try {
            // const baseUrl = await AppSettings.AUTH_URL();
            let body = JSON.stringify(data);

            const response = await axios.post(`${'https://jwtauth.jwtechinc.com/'}${apiname}`, body, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching data from ${apiname}`, error);
            throw error;
        }
    },
};
