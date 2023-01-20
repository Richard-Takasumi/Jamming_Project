
import React from 'react';
import './App.css';
import {SearchBar} from '../SearchBar/SearchBar.js'
import {SearchResults} from '../SearchResults/SearchResults.js'
import {Playlist} from '../Playlist/Playlist.js'


class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      searchResults: [
        {
          name: "name1",
          artist: "artist1",
          album: "album1",
          id: 1
        }, 
        {
          name: "name2",
          artist: "artist2",
          album: "album2",
          id: 2
        }, 
        {
          name: "name3",
          artist: "artist3",
          album: "album3",
          id: 3
        }
      ],
      playlistName: "My Playlist!",
      playlistTracks: [
        {
          name: "name4",
          artist: "artist4",
          album: "album4",
          id: 4
        }, 
        {
          name: "name5",
          artist: "artist5",
          album: "album5",
          id: 5
        }, 
        {
          name: "name6",
          artist: "artist6",
          album: "album6",
          id: 6
        }
      ]
      
    }

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
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

    if (tracks.find( (obj) => obj.id === track.id )){
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

  render(){
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar/>
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
            <Playlist playlistName={this.state.playlistName} 
                      playlistTracks={this.state.playlistTracks}
                      onRemove={this.removeTrack}/>
          </div>
        </div>
      </div>
      );
  }
}

export default App;
