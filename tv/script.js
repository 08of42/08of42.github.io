function image(src){// helper function since i can't `new Image(src)`
	const img=new Image();
	img.src=src;
	return img;
}
const channels=[
	{video:image("channels/black_noise.png"      ),audio:new Audio("channels/white_noise.ogg"  ),frame_time:1,                },
	{video:image("channels/block_game.png"       ),audio:new Audio("channels/blocky_game.ogg"  ),frame_time:6,                },
	{video:image("channels/colour_test.png"      ),audio:new Audio("channels/colour_test.ogg"  ),frame_time:1,                },
	{video:image("channels/dance_music.png"      ),audio:new Audio("channels/dance_music.ogg"  ),frame_time:2,interpolate:true},
	{video:image("channels/heart_screensaver.png"),audio:null                                   ,frame_time:1,                },
	{video:image("channels/herobrine.png"        ),audio:new Audio("channels/colour_test.ogg"  ),frame_time:3,                },
	{video:image("channels/ocean_sunset.png"     ),audio:new Audio("channels/ocean_sunset.ogg" ),frame_time:4,interpolate:true},
	{video:image("channels/pong.png"             ),audio:new Audio("channels/retro_song.ogg"   ),frame_time:2,                },
	{video:image("channels/rip_blizzard.png"     ),audio:new Audio("channels/chirp_song.ogg"   ),frame_time:4,                },
	{video:image("channels/silly_face.png"       ),audio:null                                   ,frame_time:5,                },
	{video:image("channels/villager_news.png"    ),audio:new Audio("channels/villager_news.ogg"),frame_time:5,                },
	{video:image("channels/white_noise.png"      ),audio:new Audio("channels/white_noise.ogg"  ),frame_time:1,                },
];
for(const{audio}of channels)if(audio)audio.loop=true;
const noise={video:image("channels/white_noise.png"),audio:new Audio("channels/white_noise.ogg"),frame_time:1,};
noise.audio.loop=true;

const ctx=document.createElement("canvas").getContext("2d");
ctx.canvas.width=16;ctx.canvas.height=16;// scaled to fit current texture set, may change later if i want to add new channels
requestAnimationFrame(t=>document.body.appendChild(ctx.canvas));// wait for the page to load then insert canvas

let currentChannel=null;
requestAnimationFrame(function frame(t){
	const{width,height}=ctx.canvas;
	ctx.clearRect(0,0,width,height);
	if(!currentChannel)return void requestAnimationFrame(frame);// TV is "off", don't draw anything but keep the loop going
	const{video,audio,frame_time=1,interpolate=false}=currentChannel;// get channel data
	// TODO: interpolate frames
	const i=Math.floor(24*t/1000/frame_time)%(video.height/video.width);// get current frame from time at `24/frame_time` fps
	ctx.drawImage(video,	0,i*video.width,video.width,video.width,	0,0,width,height);
	requestAnimationFrame(frame);
});

async function setChannel(id){
	currentChannel?.audio?.pause();// stop last channel
	// turn off the TV
	if(id===false){
		currentChannel=null;
		return;
	}
	// channel switch static for effect
	currentChannel=noise;
	noise.audio.play();
	await new Promise(res=>setTimeout(res,250));
	noise.audio.pause();
	// actually play the selected channel
	currentChannel=channels[id]??null;
	currentChannel?.audio?.play();
}
