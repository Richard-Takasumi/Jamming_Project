


let accessToken;
const clientID = '4cf091c473324798a342b84bf0d8924e';
const redirectUri = "http://localhost:3000/";

const Spotify = {
    getAccessToken() {
        if (accessToken) {
            return accessToken;
        }

        //check for a access token match in the URL
        // window.location.href returns the URL
        // .match searches that string using RegEx, so yeah.
        // .match will also return 
        let accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        let expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        if (accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);

            // this clears the parameters, allowing us to grab a new access token when it expires.
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;
        } else {
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`
            window.location = accessUrl;
            // accessTokenMatch = window.location.href.match(/access_token=([^&]*])/)
            // accessTokenMatch = window.location.href
            
        }
    },
    async search(term) {
        const accessToken = Spotify.getAccessToken();
        const url = `https://api.spotify.com/v1/search?type=track&q=${term}`;
        try {

        
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        const jsonResponse = await response.json();
        if (!jsonResponse.tracks) {
            return [];
        }
        const responseArr = jsonResponse.tracks.items.map(track => ({
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri
        }));
        return responseArr;
        }
        catch (err) {
            alert("Unable to find song, please choose a different name")
        }
    },

    async savePlaylist(name, uriArr) {
        // ensure both name and uriArr are defined.
        if ( !name || !uriArr.length) {
            return;
        }

        const headers = {
            Authorization: `Bearer ${accessToken}`
        }
        let userID;
        const baseUrl = 'https://api.spotify.com/v1'
        const getUserID = `${baseUrl}/me`
        

        try {
            // get user ID
            const response = await fetch(getUserID, {
                headers: headers
            });
            const jsonResponse = await response.json();
            userID = jsonResponse.id;

            // using User ID, create a new playlist for them
            const postPlaylistUrl = `${baseUrl}/users/${userID}/playlists`
            const createPlaylistResponse = await fetch(postPlaylistUrl, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(
                    {
                    name: name,
                    description: "Your Jammming created playlist!",
                    public: true
                })

            })
            // get the playlist ID
            const playlistResponseJson = await createPlaylistResponse.json();
            const playlistID = playlistResponseJson.id;

            // post all tracks from uriArr to the playlist.
            
            // append all spotify uris from the uriArr to the URL for our post request
            let itemsToPlaylistUrl = `${baseUrl}/playlists/${playlistID}/tracks?uris=`
            uriArr.forEach(async (element) => {
                let tempAddUrl = itemsToPlaylistUrl + `${element}`;
                await fetch(tempAddUrl, {
                    method: 'POST',
                    headers: headers
                })
            });


        }   
        catch (err) {
            alert(err);
        }

    }


};

export default Spotify;