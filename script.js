let count = 0;
const msg = document.getElementById('msg');

document.getElementById('btn').addEventListener('click', () => {
  count += 1;
  msg.textContent = `${count}번 클릭했어요!`;
});
