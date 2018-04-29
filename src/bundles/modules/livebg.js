import jQuery from 'jquery';

const video = ['video1', 'video2', 'video3', 'video4'];
let curVideo = 0;

const liveBG = {

	setRandomVideo() {
		curVideo = Math.floor((Math.random() * video.length));
		this.setVideo();
	},

	setVideo() {
		if (curVideo >= video.length)
			curVideo = 0;

		$('#bg').attr('src', '/img/' + video[curVideo] + '.mpeg');
		$('#bg').attr('poster', '/img/' + video[curVideo++] + '.jpg');
	}

};

export default liveBG;