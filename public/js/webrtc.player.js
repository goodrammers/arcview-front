
//
// Copyright (c) 2013-2021 Winlin
//
// SPDX-License-Identifier: MIT
//

'use strict';

// Depends on adapter-7.4.0.min.js from https://github.com/webrtc/adapter
// Async-awat-prmise based SRS RTC Player by WHEP.
// @url The WebRTC url to play with, for example:
//      http://localhost:1985/rtc/v1/whep/?app=live&stream=livestream
function RtcWhepAsyncPlayer(url) {
    var self = {};

    self.url = url;
    self.isPlaying = false;
    self.autoReconnect = true;
    self.pollInterval = 10000; // 10 secs

    self.pc = null;

    self.stream = new MediaStream();

    // The callback when got local stream.
    // @see https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/addStream#Migrating_to_addTrack
    self.ontrack = function (event) {
        console.log("Got track: ", event.track);
        // Add track to stream of player.
        self.stream.addTrack(event.track);
    };

    // internal: init RTCPeerConnection
    self._initPC = function () {
        if (self.pc) {
            try {
                self.pc.close();
            } catch (e) {
            }
        }
        self.pc = new RTCPeerConnection(null);
        // https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/ontrack
        self.pc.ontrack = function (event) {
            if (self.ontrack) {
                self.ontrack(event);
            }
        };
    };

    // Close the player.
    self.close = function () {
        if (self.pc) {
            self.stream.getTracks().forEach(function (t) {
                try {
                    t.stop();
                } catch (e) {
                }
                self.stream.removeTrack(t);
            });
            try {
                self.pc.close();
            } catch (e) {
            }
            self.pc = null;
        }
        self.isPlaying = false;
        if (self.onClose) {
            self.onClose();
        }
    };

    // See https://datatracker.ietf.org/doc/draft-ietf-wish-whep/
    self.play = async function() {
        if (!self.url.includes('/whip-play/') && !self.url.includes('/whep/'))
            throw new Error(`invalid WHEP url ${self.url}`);

        if (self.isPlaying) return;
        self.isPlaying = true;

        if (self.onPlay) {
            self.onPlay();
        }

        self._initPC();

        // Create a new RTCRtpTransceiver and add it to pc
        self.pc.addTransceiver("video", {direction: "recvonly"});

        var offer = await self.pc.createOffer();
        await self.pc.setLocalDescription(offer);
        const answer = await new Promise(function(resolve, reject) {
            console.log(`Generated offer: ${offer.sdp}`);

            const xhr = new XMLHttpRequest();
            xhr.onload = function() {
                if (xhr.readyState !== xhr.DONE) return;
                if (xhr.status !== 200 && xhr.status !== 201) return reject(xhr);
                const data = xhr.responseText;
                console.log("Got answer: ", data);
                return data.code ? reject(xhr) : resolve(data);
            }
            xhr.open('POST', self.url, true);
            xhr.setRequestHeader('Content-type', 'application/sdp');
            xhr.send(offer.sdp);
        });
        await self.pc.setRemoteDescription(
            new RTCSessionDescription({type: 'answer', sdp: answer})
        );

        return self.__internal.parseId(offer.sdp, answer);
    };

    // Internal APIs.
    self.__internal = {
        parseId: (offer, answer) => {
            let sessionid = offer.substr(offer.indexOf('a=ice-ufrag:') + 'a=ice-ufrag:'.length);
            sessionid = sessionid.substr(0, sessionid.indexOf('\n') - 1) + ':';
            sessionid += answer.substr(answer.indexOf('a=ice-ufrag:') + 'a=ice-ufrag:'.length);
            sessionid = sessionid.substr(0, sessionid.indexOf('\n'));

            return {
                sessionid: sessionid, // Should be ice-ufrag of answer:offer.
            };
        },
    };

    async function checkStreamStatus() {
        try {
            const urlObj = new URL(self.url);
            const apiUrl = `${urlObj.protocol}//${urlObj.host}/api/v1/streams`;
            const resp = await fetch(apiUrl);
            if (!resp.ok) throw new Error('SRS API request failed');
            const data = await resp.json();

            const appName = urlObj.searchParams.get('app') || 'live';
            const streamName = urlObj.searchParams.get('stream') || 'stream';

            const target = data.streams.find(s => s.app === appName && s.name === streamName);
            return target && target.clients > 0 && target.video != null ? 'online' : 'offline';
        } catch (err) {
            console.warn('[SRS] Status check error:', err);
            return 'offline';
        }
    }

    if (self.autoReconnect) {
        setInterval(async () => {
            const status = await checkStreamStatus();
            if (status === 'online' && !self.isPlaying) {
                console.log('[WHEP] Stream online → play');
                self.play();
            } else if (status === 'offline' && self.isPlaying) {
                console.log('[WHEP] Stream offline → close');
                self.close();
            }
        }, self.pollInterval);
    }

    return self;
}

