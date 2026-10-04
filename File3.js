/**
 * MediPulse Hospital Management System
 * Front-end Logic and Dynamic UI Handlers
 */

// Application State
const state = {
  appointments: [
    { id: 1, patient: "Ananya Iyer", department: "Cardiology", doctor: "Dr. A. Sharma", time: "10:00 AM", status: "Confirmed" },
    { id: 2, patient: "Karthik Raja", department: "Orthopedics", doctor: "Dr. M. Roy", time: "11:15 AM", status: "Pending" },
    { id: 3, patient: "Venkatesh P.", department: "General Medicine", doctor: "Dr. N. Rao", time: "12:00 PM", status: "Confirmed" },
    { id: 4, patient: "Pooja Hegde", department: "Neurology", doctor: "Dr. P. Das", time: "02:30 PM", status: "Confirmed" }
  ],
  patients: [
    { id: "PID-201", name: "Ananya Iyer", age: 29, gender: "F", blood: "B+", phone: "+91 98765 01234", status: "Outpatient" },
    { id: "PID-202", name: "Karthik Raja", age: 44, gender: "M", blood: "O+", phone: "+91 91234 56789", status: "Admitted" },
    { id: "PID-203", name: "Suresh Babu", age: 52, gender: "M", blood: "A+", phone: "+91 99887 76655", status: "Discharged" },
    { id: "PID-204", name: "Pooja Hegde", age: 31, gender: "F", blood: "AB+", phone: "+91 98221 44556", status: "Outpatient" }
  ],
  beds: Array.from({ length: 18 }, (_, i) => ({
    id: `B-${101 + i}`,
    status: i % 5 === 0 ? "maintenance" : (i % 2 === 0 ? "occupied" : "available")
  }))
};

// Section / Tab Navigation
function switchTab(tabId) {
  // Hide all sections
  document.querySelectorAll('.tab-content').forEach(section => {
    section.classList.remove('active');
  });

  // Remove active style from nav buttons
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('active');
  });

  // Activate selected section
  const targetSection = document.getElementById(`tab-${tabId}`);
  if (targetSection) {
    targetSection.classList.add('active');
  }

  // Highlight selected tab button
  const activeBtn = document.querySelector(`.nav-btn[data-tab="${tabId}"]`);
  if (activeBtn) {
    activeBtn.classList.add('active');
  }

  // Dynamic Title Update
  const titles = {
    dashboard: "Hospital Overview",
    appointments: "Appointments Schedule",
    patients: "Patient Directory",
    beds: "Ward & Bed Allocations"
  };
  document.getElementById('page-title').innerText = titles[tabId] || "Hospital Management";
}

// Modal Toggle Function
function toggleModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.toggle('hidden');
  }
}

// Render Functions
function renderAppointments() {
  const quickTbody = document.getElementById('quick-appointments-tbody');
  const fullTbody = document.getElementById('full-appointments-tbody');

  const rows = state.appointments.map(app => `
    <tr>
      <td class="patient-cell">${app.patient}</td>
      <td>${app.department}</td>
      <td>${app.doctor}</td>
      <td>${app.time}</td>
      <td>
        <span class="badge ${app.status.toLowerCase()}">${app.status}</span>
      </td>
      ${fullTbody ? `
      <td class="text-right">
        <button class="action-btn" onclick="removeAppointment(${app.id})">Cancel</button>
      </td>` : ''}
    </tr>
  `).join('');

  if (quickTbody) quickTbody.innerHTML = rows;
  if (fullTbody) fullTbody.innerHTML = rows;

  // Update Metric Card
  const appointmentCountEl = document.getElementById('stat-appointments-today');
  if (appointmentCountEl) {
    appointmentCountEl.innerText = state.appointments.length;
  }
}

function renderPatients() {
  const tbody = document.getElementById('patients-tbody');
  if (!tbody) return;

  tbody.innerHTML = state.patients.map(p => `
    <tr>
      <td class="id-badge">${p.id}</td>
      <td class="patient-cell">${p.name}</td>
      <td>${p.age} yrs (${p.gender})</td>
      <td><strong>${p.blood}</strong></td>
      <td>${p.phone}</td>
      <td>
        <span class="badge ${p.status.toLowerCase()}">${p.status}</span>
      </td>
    </tr>
  `).join('');

  const patientCountEl = document.getElementById('stat-patients-count');
  if (patientCountEl) {
    patientCountEl.innerText = state.patients.length + 1244; // combined simulated total
  }
}

function renderBeds() {
  const grid = document.getElementById('bed-grid');
  if (!grid) return;

  grid.innerHTML = state.beds.map(bed => `
    <div class="bed-card ${bed.status}" onclick="toggleBedStatus('${bed.id}')" title="Click to toggle status">
      <span class="indicator ${bed.status}"></span>
      <span class="bed-id">${bed.id}</span>
      <span class="bed-status-text">${bed.status}</span>
    </div>
  `).join('');

  // Update Bed Stats
  const occupiedCount = state.beds.filter(b => b.status === 'occupied').length;
  const totalBeds = state.beds.length;
  const occupancyPercent = Math.round((occupiedCount / totalBeds) * 100);

  document.getElementById('stat-beds-count').innerText = `${occupiedCount} / ${totalBeds}`;
  document.getElementById('stat-beds-percent').innerText = `${occupancyPercent}% capacity`;
}

// Action Handlers
function handleAppointmentSubmit(e) {
  e.preventDefault();
  const patient = document.getElementById('app-patient').value.trim();
  const department = document.getElementById('app-dept').value;
  const doctor = document.getElementById('app-doctor').value.trim();
  const time = document.getElementById('app-time').value.trim();

  if (!patient || !doctor || !time) return;

  state.appointments.unshift({
    id: Date.now(),
    patient,
    department,
    doctor,
    time,
    status: 'Confirmed'
  });

  renderAppointments();
  toggleModal('appointment-modal');
  e.target.reset();
}

function handlePatientSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('pat-name').value.trim();
  const age = document.getElementById('pat-age').value;
  const gender = document.getElementById('pat-gender').value;
  const blood = document.getElementById('pat-blood').value;
  const phone = document.getElementById('pat-phone').value.trim();

  if (!name || !phone) return;

  const newPatient = {
    id: `PID-${Math.floor(100 + Math.random() * 900)}`,
    name,
    age,
    gender,
    blood,
    phone,
    status: 'Outpatient'
  };

  state.patients.unshift(newPatient);
  renderPatients();
  toggleModal('patient-modal');
  e.target.reset();
}

function removeAppointment(id) {
  state.appointments = state.appointments.filter(app => app.id !== id);
  renderAppointments();
}

// Interactive helper: Toggle bed status by clicking on a bed
function toggleBedStatus(bedId) {
  const bed = state.beds.find(b => b.id === bedId);
  if (!bed) return;

  if (bed.status === 'available') bed.status = 'occupied';
  else if (bed.status === 'occupied') bed.status = 'maintenance';
  else bed.status = 'available';

  renderBeds();
}

// Global Search Filter
function setupSearch() {
  const searchInput = document.getElementById('global-search');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();

    // Filter appointments
    const filteredAppointments = state.appointments.filter(a => 
      a.patient.toLowerCase().includes(query) ||
      a.doctor.toLowerCase().includes(query) ||
      a.department.toLowerCase().includes(query)
    );

    // Filter patients
    const filteredPatients = state.patients.filter(p => 
      p.name.toLowerCase().includes(query) ||
      p.id.toLowerCase().includes(query) ||
      p.phone.includes(query)
    );

    // Re-render matching subsets if searching, else reset
    if (query) {
      document.getElementById('full-appointments-tbody').innerHTML = filteredAppointments.map(app => `
        <tr>
          <td class="patient-cell">${app.patient}</td>
          <td>${app.department}</td>
          <td>${app.doctor}</td>
          <td>${app.time}</td>
          <td><span class="badge ${app.status.toLowerCase()}">${app.status}</span></td>
          <td class="text-right"><button class="action-btn" onclick="removeAppointment(${app.id})">Cancel</button></td>
        </tr>
      `).join('');

      document.getElementById('patients-tbody').innerHTML = filteredPatients.map(p => `
        <tr>
          <td class="id-badge">${p.id}</td>
          <td class="patient-cell">${p.name}</td>
          <td>${p.age} yrs (${p.gender})</td>
          <td><strong>${p.blood}</strong></td>
          <td>${p.phone}</td>
          <td><span class="badge ${p.status.toLowerCase()}">${p.status}</span></td>
        </tr>
      `).join('');
    } else {
      renderAppointments();
      renderPatients();
    }
  });
}

// Initialize on DOM load
window.addEventListener('DOMContentLoaded', () => {
  // Setup tab click listeners
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-tab');
      switchTab(tab);
    });
  });

  // Attach form listeners
  const appForm = document.getElementById('appointment-form');
  if (appForm) appForm.addEventListener('submit', handleAppointmentSubmit);

  const patForm = document.getElementById('patient-form');
  if (patForm) patForm.addEventListener('submit', handlePatientSubmit);

  // Initial renders
  renderAppointments();
  renderPatients();
  renderBeds();
  setupSearch();

  // Initialize Lucide icons
  if (window.lucide) {
    window.lucide.createIcons();
  }
});