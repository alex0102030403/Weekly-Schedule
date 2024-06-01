document.addEventListener('DOMContentLoaded', function() {
    class ActivityManager {
        constructor() {
            this.currentUser = localStorage.getItem('currentUser');
            if (!this.currentUser) {
                window.location.href = 'login.html';
            }
            this.users = JSON.parse(localStorage.getItem('users')) || {};
            this.activities = this.users[this.currentUser].activities || [];
            this.editingActivityIndex = null;
            this.scheduleTable = document.getElementById('schedule-table');
            this.scheduleBody = document.getElementById('schedule-body');
            this.newActivityButton = document.getElementById('new-activity');
            this.logoutButton = document.getElementById('logout-button');
            this.modal = document.getElementById('modal');
            this.activityNameInput = document.getElementById('activity-name');
            this.activityDescriptionInput = document.getElementById('activity-description');
            this.activityDayInput = document.getElementById('activity-day');
            this.activityTimeInput = document.getElementById('activity-time');
            this.saveActivityButton = document.getElementById('save-activity');
            this.cancelButton = document.getElementById('cancel');

            this.initialize();
        }

        initialize() {
            this.generateTimeOptions();
            this.generateScheduleTable();
            this.newActivityButton.addEventListener('click', () => this.showModal());
            this.saveActivityButton.addEventListener('click', () => this.saveActivity());
            this.cancelButton.addEventListener('click', () => this.hideModal());
            this.logoutButton.addEventListener('click', () => this.logout());
            window.addEventListener('click', (event) => {
                if (event.target === this.modal) {
                    this.hideModal();
                }
            });

            this.renderActivities();
        }

        generateTimeOptions() {
            for (let hour = 8; hour <= 22; hour++) {
                const option = document.createElement('option');
                option.value = `${hour}:00`;
                option.textContent = this.formatTime(hour);
                this.activityTimeInput.appendChild(option);
            }
        }

        formatTime(hour) {
            const period = hour >= 12 ? 'PM' : 'AM';
            const adjustedHour = hour % 12 || 12;
            return `${adjustedHour}:00 ${period}`;
        }

        generateScheduleTable() {
            for (let hour = 8; hour <= 22; hour++) {
                const row = document.createElement('tr');
                const timeCell = document.createElement('td');
                timeCell.textContent = this.formatTime(hour);
                row.appendChild(timeCell);
                for (let day = 0; day < 7; day++) {
                    const cell = document.createElement('td');
                    cell.dataset.day = day;
                    cell.dataset.hour = hour;
                    row.appendChild(cell);
                }
                this.scheduleBody.appendChild(row);
            }
        }

        renderActivities() {
            const dayMap = {
                'Monday': 0,
                'Tuesday': 1,
                'Wednesday': 2,
                'Thursday': 3,
                'Friday': 4,
                'Saturday': 5,
                'Sunday': 6
            };
            Array.from(this.scheduleBody.getElementsByTagName('td')).forEach(cell => {
                if (cell.dataset.day !== undefined) {
                    cell.innerHTML = '';
                }
            });
            this.activities.forEach((activity, index) => {
                const dayIndex = dayMap[activity.day];
                const timeIndex = parseInt(activity.time.split(':')[0], 10);
                const cell = this.scheduleBody.querySelector(`td[data-day='${dayIndex}'][data-hour='${timeIndex}']`);
                if (cell) {
                    const activityDiv = document.createElement('div');
                    activityDiv.className = 'activity' + (activity.completed ? ' completed' : ' incomplete');
                    activityDiv.innerHTML = `
                        <div>
                            <strong>${activity.name}</strong>
                            <p>${activity.description}</p>
                        </div>
                        <div class="activity-actions">
                            <button onclick="activityManager.editActivity(${index})">Edit</button>
                            <button class="complete" onclick="activityManager.completeActivity(${index})">${activity.completed ? 'Completed' : 'Complete'}</button>
                            <button onclick="activityManager.deleteActivity(${index})">Delete</button>
                        </div>
                    `;
                    cell.appendChild(activityDiv);
                }
            });
        }

        saveActivities() {
            this.users[this.currentUser].activities = this.activities;
            localStorage.setItem('users', JSON.stringify(this.users));
        }

        showModal(index = null) {
            this.editingActivityIndex = index;
            if (index !== null) {
                const activity = this.activities[index];
                this.activityNameInput.value = activity.name;
                this.activityDescriptionInput.value = activity.description;
                this.activityDayInput.value = activity.day;
                this.activityTimeInput.value = activity.time;
            } else {
                this.activityNameInput.value = '';
                this.activityDescriptionInput.value = '';
                this.activityDayInput.value = 'Monday';
                this.activityTimeInput.value = '8:00';
            }
            this.modal.style.display = 'block';
        }

        hideModal() {
            this.modal.style.display = 'none';
        }

        saveActivity() {
            const name = this.activityNameInput.value.trim();
            const description = this.activityDescriptionInput.value.trim();
            const day = this.activityDayInput.value;
            const time = this.activityTimeInput.value;
            if (name && description && day && time) {
                if (this.editingActivityIndex !== null) {
                    this.activities[this.editingActivityIndex] = { name, description, day, time, completed: this.activities[this.editingActivityIndex].completed };
                } else {
                    this.activities.push({ name, description, day, time, completed: false });
                }
                this.saveActivities();
                this.renderActivities();
                this.hideModal();
            }
        }

        editActivity(index) {
            this.showModal(index);
        }

        completeActivity(index) {
            this.activities[index].completed = !this.activities[index].completed;
            this.saveActivities();
            this.renderActivities();
        }

        deleteActivity(index) {
            this.activities.splice(index, 1);
            this.saveActivities();
            this.renderActivities();
        }

        logout() {
            localStorage.removeItem('currentUser');
            window.location.href = 'login.html';
        }
    }

    // Initialize the ActivityManager class
    const activityManager = new ActivityManager();
    window.activityManager = activityManager; // Expose to global scope for event handler access
});
