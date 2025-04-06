const { createAudioPlayer, createAudioResource, joinVoiceChannel, AudioPlayerStatus, VoiceConnectionStatus } = require('@discordjs/voice');
const play = require('play-dl');

class MusicPlayer {
  constructor() {
    this.queues = new Map();
  }
  
  getQueue(guildId) {
    if (!this.queues.has(guildId)) {
      this.queues.set(guildId, {
        songs: [],
        playing: false,
        connection: null,
        player: null,
        volume: 100,
        loop: false,
      });
    }
    
    return this.queues.get(guildId);
  }
  
  async play(guildId, song) {
    const queue = this.getQueue(guildId);
    
    if (!song) {
      if (queue.connection) {
        queue.connection.destroy();
      }
      this.queues.delete(guildId);
      return;
    }
    
    try {
      let stream;
      if (song.url.includes('youtube.com') || song.url.includes('youtu.be')) {
        stream = await play.stream(song.url);
      } else {
        // Handle other sources if needed
        return;
      }
      
      const resource = createAudioResource(stream.stream, { 
        inputType: stream.type,
        inlineVolume: true
      });
      resource.volume.setVolume(queue.volume / 100);
      
      if (!queue.player) {
        queue.player = createAudioPlayer();
        queue.connection.subscribe(queue.player);
        
        queue.player.on(AudioPlayerStatus.Idle, () => {
          if (queue.loop) {
            // If loop is enabled, add the current song to the end of the queue
            queue.songs.push(queue.songs.shift());
          } else {
            queue.songs.shift();
          }
          this.play(guildId, queue.songs[0]);
        });
        
        queue.player.on('error', error => {
          console.error(`Error: ${error.message}`);
          queue.songs.shift();
          this.play(guildId, queue.songs[0]);
        });
      }
      
      queue.player.play(resource);
      queue.playing = true;
    } catch (error) {
      console.error(error);
      queue.songs.shift();
      this.play(guildId, queue.songs[0]);
    }
  }
  
  async addSong(message, url) {
    const queue = this.getQueue(message.guild.id);
    
    try {
      let songInfo;
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        songInfo = await play.video_info(url);
        const song = {
          title: songInfo.video_details.title,
          url: songInfo.video_details.url,
          duration: songInfo.video_details.durationInSec,
          thumbnail: songInfo.video_details.thumbnails[0].url,
          requestedBy: message.author.tag
        };
        
        queue.songs.push(song);
        
        if (!queue.connection) {
          const voiceChannel = message.member.voice.channel;
          if (!voiceChannel) {
            return { success: false, message: 'You need to be in a voice channel to play music!' };
          }
          
          const permissions = voiceChannel.permissionsFor(message.client.user);
          if (!permissions.has('Connect') || !permissions.has('Speak')) {
            return { success: false, message: 'I need permissions to join and speak in your voice channel!' };
          }
          
          queue.connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator,
          });
          
          queue.connection.on(VoiceConnectionStatus.Disconnected, async () => {
            try {
              this.queues.delete(message.guild.id);
            } catch (error) {
              console.error(error);
              this.queues.delete(message.guild.id);
            }
          });
          
          if (!queue.playing) {
            this.play(message.guild.id, queue.songs[0]);
          }
        }
        
        return { success: true, song };
      } else {
        return { success: false, message: 'Only YouTube links are supported at the moment.' };
      }
    } catch (error) {
      console.error(error);
      return { success: false, message: 'An error occurred while trying to add the song.' };
    }
  }
  
  skip(guildId) {
    const queue = this.getQueue(guildId);
    if (!queue.player) return false;
    
    queue.player.stop();
    return true;
  }
  
  stop(guildId) {
    const queue = this.getQueue(guildId);
    if (!queue.connection) return false;
    
    queue.songs = [];
    queue.player.stop();
    queue.connection.destroy();
    this.queues.delete(guildId);
    return true;
  }
  
  pause(guildId) {
    const queue = this.getQueue(guildId);
    if (!queue.player || !queue.playing) return false;
    
    queue.player.pause();
    queue.playing = false;
    return true;
  }
  
  resume(guildId) {
    const queue = this.getQueue(guildId);
    if (!queue.player || queue.playing) return false;
    
    queue.player.unpause();
    queue.playing = true;
    return true;
  }
  
  setVolume(guildId, volume) {
    const queue = this.getQueue(guildId);
    if (!queue.player) return false;
    
    queue.volume = volume;
    if (queue.player.state.resource) {
      queue.player.state.resource.volume.setVolume(volume / 100);
    }
    return true;
  }
  
  toggleLoop(guildId) {
    const queue = this.getQueue(guildId);
    queue.loop = !queue.loop;
    return queue.loop;
  }
  
  getQueue(guildId) {
    return this.queues.get(guildId);
  }
}

module.exports = new MusicPlayer();