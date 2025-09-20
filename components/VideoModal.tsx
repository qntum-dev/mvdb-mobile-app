import { Video } from '@/interfaces/interfaces';
import React from 'react';
import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';

interface VideoModalProps {
  visible: boolean;
  onClose: () => void;
  video: Video | null;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const VideoModal = ({ visible, onClose, video }: VideoModalProps) => {
  // Display error modal for unsupported/no video as before
  if (!video || video.site !== 'YouTube') {
    return (
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onClose}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        >
          <View >
            <Text style={styles.errorText}>
              {!video
                ? 'No video available'
                : `Videos from ${video.site} are not supported yet`}
            </Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.contentCard}>
          <View style={styles.playerContainer}>
            <YoutubePlayer
              height={Math.min(screenWidth * 0.5625, 220)} // Maximum height for better modal fit
              width={screenWidth - 48}
              videoId={video.key}
              play={true}
            />
          </View>

          <Text style={styles.videoTitle} numberOfLines={2} ellipsizeMode="tail">
            {video.name}
          </Text>
          <Text style={styles.videoType}>{video.type}</Text>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.85}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.82)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  contentCard: {
    backgroundColor: '#18181a',
    borderRadius: 18,
    paddingHorizontal: 0,
    paddingVertical: 0,
    width: screenWidth - 32,
    maxWidth: 430,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.21,
    shadowRadius: 6,
    elevation: 8,
    alignItems: 'center',
    overflow: 'hidden'
  },
  playerContainer: {
    width: '100%',
    alignItems: 'center',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    overflow: 'hidden'
  },
  videoTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 20,
    marginHorizontal: 18
  },
  videoType: {
    color: '#f87171',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
    textAlign: 'center'
  },
  closeButton: {
    backgroundColor: '#dc2626',
    paddingHorizontal: 38,
    paddingVertical: 13,
    borderRadius: 9,
    marginTop: 22,
    marginBottom: 24
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1
  },
  errorText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 28
  }
});

export default VideoModal;
