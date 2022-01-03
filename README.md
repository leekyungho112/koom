# Koom

Zoom Clone using NodeJS WebRTC and WebSockets

### 2021의 마지막 챌린지

---

- 1일차
- 1 - 1.9강의를 바탕으로 websocket chat 구현
  codeSend Box 설정시 https secure이슈로 인해 ws ---> wss로 진행

- 2일차
- Users should be able to create, join and leave rooms.
- Allow users to change nickname.
- Put the backend code on src/server.js and the frontend code on src/public/app.js.
- Extra points: Show a list of all the rooms currently on the server.

#### 2일차 과정

- 기능구현 및 추가사항

---

입장시 닉네임을 통해 채널에 참여후 메세지 전송 퇴장시에도 동일하게 구성 , 참여 채널안에서 닉네임 변경을 허용토록 하여 다른 유저에게 알림을 발송, 생성된 전체 채널을 보여준다.

- 3일차
- peerconnection 으로 유저와 서버 없이 직접 연결 되어 소통
- datachannel을 구성하여 chat 구현
- 최종적으로 css 마무리

#### last 챌린지 과정

- 기능구현

---

peerconnection으로 연결이 되어 peer A와 PeerB
프론트 단에서 백으로의 통신 없이 datachannel을 이용하여 메시지를 주고 받을 수 있다.
