const firebaseConfig = {
  apiKey: "AIzaSyB0T4faD1HQWofkNUW0gE4cejHbJX6_xA8",
  authDomain: "loginlogger99.firebaseapp.com",
  projectId: "loginlogger99",
  storageBucket: "loginlogger99.appspot.com",
  messagingSenderId: "609527553718",
  appId: "1:609527553718:web:1d0f524383b414db821017"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

function submitLogin() {
  const username = document.getElementById('username').value;
  const time = new Date().toLocaleString();

  db.ref('logins').push({ username, time });
  alert('Login Submitted!');
}

function adminLogin() {
  const pass = document.getElementById('adminPassword').value;
  if (pass === 'admin123') {
    document.getElementById('authSection').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    loadData();
  } else {
    alert('Incorrect Password');
  }
}

function loadData() {
  const tableBody = document.querySelector('#logsTable tbody');
  db.ref('logins').on('value', snapshot => {
    tableBody.innerHTML = '';
    snapshot.forEach(child => {
      const { username, time } = child.val();
      const row = `<tr><td>${username}</td><td>${time}</td></tr>`;
      tableBody.innerHTML += row;
    });
  });
}

function filterTable() {
  const input = document.getElementById('searchInput').value.toLowerCase();
  const rows = document.querySelectorAll('#logsTable tbody tr');
  rows.forEach(row => {
    const name = row.cells[0].textContent.toLowerCase();
    row.style.display = name.includes(input) ? '' : 'none';
  });
}

function exportTableToCSV() {
  let csv = 'Username,Time\n';
  document.querySelectorAll('#logsTable tbody tr').forEach(row => {
    const cols = Array.from(row.cells).map(td => td.textContent);
    csv += cols.join(',') + '\n';
  });

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'logins.csv';
  link.click();
}