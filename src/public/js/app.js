const socket = io();

const welcome = document.getElementById('welcome');
const form = welcome.querySelector('form');
const room = document.getElementById('room');

room.hidden = true;
let roomName;
let nickName;

function addMessage(message) {
  const ul = room.querySelector('ul');
  const li = document.createElement('li');
  li.innerText = message;
  ul.appendChild(li);
}
function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector('#msg input');
  const value = input.value;
  socket.emit('new_message', input.value, roomName, () => {
    addMessage(`You: ${value}`);
  });
  input.value = '';
}
// function handleNicknameSubmit(event) {
//   event.preventDefault();
//   const input = welcome.querySelector('#name input');
//   socket.emit('nickname', input.value, showRoom);
//   nickName = input.value;
//   input.value = '';
// }

function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector('h3');
  h3.innerText = `${roomName}에 입장하셨습니다.`;
  const msgForm = room.querySelector('#msg');
  msgForm.addEventListener('submit', handleMessageSubmit);
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const roominput = welcome.querySelector('#roomname');
  const nameinput = welcome.querySelector('#name');
  //emit argments에서 fn을 사용하기 위해서는 마지막 argument가 되어야 한다
  socket.emit('enter_room', roominput.value, nameinput.value, showRoom);
  roomName = roominput.value;
  nickName = nameinput.value;
  roominput.value = '';
  nameinput.value = '';
}

form.addEventListener('submit', handleRoomSubmit);

socket.on('welcome', (user, time, newCount) => {
  const h3 = room.querySelector('h3');
  h3.innerText = `${roomName}에 입장하셨습니다.(${newCount})`;
  addMessage(`${user} joined! ${time.slice(0, 15)}`);
});

socket.on('bye', (left, newCount) => {
  const h3 = room.querySelector('h3');
  h3.innerText = `${roomName}에 입장하셨습니다.(${newCount})`;
  addMessage(`${left} left ㅜㅜ!`);
});

socket.on('new_message', addMessage);

socket.on('room_change', (rooms) => {
  const roomList = welcome.querySelector('ul');
  roomList.innerHTML = '';
  if (rooms.length === 0) {
    return;
  }
  rooms.forEach((room) => {
    const li = document.createElement('li');
    li.innerText = room;
    roomList.append(li);
  });
});
