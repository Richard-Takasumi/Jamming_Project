
import React from 'react';
import './App.css';
import {SearchBar} from '../SearchBar/SearchBar.js'
import {SearchResults} from '../SearchResults/SearchResults.js'
import {Playlist} from '../Playlist/Playlist.js'
import Spotify from '../../util/Spotify.js';


class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      searchResults: [],
      playlistName: "My Playlist!",
      playlistTracks: []
      
    }

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  // because addTrack will eventually by passed as a function "pointer" 
  // and "addTrack" is a method of the App class.
  // "this" will not refer to app's "this", but rather be undefined.
  // because, function pointers lose their "this" property 
  // as they are unattached from the original object...

  // we are using "this" in the function body, to extract 
  // "this.state.playlistTracks"
  // we are also updating the state using this.setState
  // therefore we need to bind "this" such that all future calls of addTrack 
  // have a "this" which refers to the original App object
  addTrack(track) {
    // checks if track.id is NOT in playlistTracks already
    let tracks = this.state.playlistTracks;

    if (tracks.find(obj => obj.id === track.id )){
      return;
    } 
    tracks.push(track)
    this.setState({playlistTracks: tracks});
  }

  removeTrack(track) {
    let tracks = this.state.playlistTracks;
    tracks = tracks.filter(currentTrack => currentTrack.id !== track.id)

    this.setState({playlistTracks: tracks});
  }

  updatePlaylistName(name) {
    this.setState({playlistName: name})
  }

  savePlaylist() {
    const trackURIs = this.state.playlistTracks.map((track) => track.uri)
    Spotify.savePlaylist(this.state.playlistName, trackURIs);
    this.setState( {
      playlistTracks: []
    })
  }

  search(term) {
    Spotify.search(term).then(searchResults => {
      this.setState({
        searchResults: searchResults,
        playlistName: "My Playlist"})
    });
  }




  render(){
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
            <Playlist playlistName={this.state.playlistName} 
                      playlistTracks={this.state.playlistTracks}
                      onRemove={this.removeTrack}
                      onNameChange={this.updatePlaylistName}
                      onSave={this.savePlaylist}/>
          </div>
        </div>
      </div>
      );
  }
}

export default App;
