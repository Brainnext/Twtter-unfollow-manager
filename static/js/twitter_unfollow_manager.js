 const connectBtn = document.getElementById('connect-btn');
        const connectBtnText = document.getElementById('connect-btn-text');
        const connectSpinner = document.getElementById('connect-spinner');
        const statusMessage = document.getElementById('status-message');
        const infoSection = document.getElementById('info-section');
        const testimonialsSection = document.getElementById('testimonials-section');
        const unfollowSection = document.getElementById('unfollow-section');
        const userProfileContainer = document.getElementById('user-profile');
        const userListContainer = document.getElementById('user-list');
        const selectAllCheckbox = document.getElementById('select-all-checkbox');
        const unfollowSelectedBtn = document.getElementById('unfollow-selected-btn');
        const unfollowBtnText = document.getElementById('unfollow-btn-text');
        const unfollowSpinner = document.getElementById('unfollow-spinner');
        const selectedCountSpan = document.getElementById('selected-count');
        const disconnectBtn = document.getElementById('disconnect-btn');
        const unfollowModal = document.getElementById('unfollow-modal');
        const modalUserList = document.getElementById('modal-user-list');
        const modalCancelBtn = document.getElementById('modal-cancel-btn');
        const modalConfirmBtn = document.getElementById('modal-confirm-btn');
        const searchInput = document.getElementById('search-input');
        const clearSearchBtn = document.getElementById('clear-search-btn');
        const sortSelect = document.getElementById('sort-select');

        const urlParams = new URLSearchParams(window.location.search);
        let userId = urlParams.get('user_id') || localStorage.getItem('twitter_user_id');
        let followedUsers = []; // New global variable to store the original list

        function renderUserCard(user) {
            const gender = user.id % 2 === 0 ? 'men' : 'women';
            const imageUrl = `https://randomuser.me/api/portraits/thumb/${gender}/${user.id}.jpg`;
            const card = document.createElement('div');
            card.className = "bg-white border border-gray-200 rounded-2xl shadow-sm p-4 flex items-start space-x-4 transition-transform hover:scale-[1.02] duration-200";
            card.innerHTML = `
                <input type="checkbox" data-id="${user.id}" class="user-checkbox h-5 w-5 mt-1 text-red-600 rounded focus:ring-red-500">
                <img src="${imageUrl}" alt="${user.name}'s avatar" class="w-12 h-12 rounded-full ring-2 ring-gray-200">
                <div class="flex-1">
                    <p class="font-semibold text-gray-900">${user.name}</p>
                    <p class="text-sm text-gray-500">@${user.handle}</p>
                    <div class="mt-2 flex items-center text-xs font-medium text-gray-600">
                        <span class="mr-1">Score:</span>
                        <span class="font-bold text-lg ${user.score > 50 ? 'text-green-600' : 'text-red-600'}">${user.score}</span>
                        <p class="ml-2 text-gray-500">(low score = unfollow)</p>
                    </div>
                    <!-- New: Brief detailed info -->
                    <div class="text-xs text-gray-400 mt-2 space-y-1">
                        <p>Followers: <span class="text-gray-600 font-medium">${user.followers_count || 'N/A'}</span></p>
                        <p>Last Tweet: <span class="text-gray-600 font-medium">${user.last_tweet_date || 'N/A'}</span></p>
                    </div>
                </div>
            `;
            userListContainer.appendChild(card);
        }

        function updateSelectedCount() {
            const selectedCount = document.querySelectorAll('.user-checkbox:checked').length;
            selectedCountSpan.textContent = selectedCount;
            unfollowSelectedBtn.disabled = selectedCount === 0;
        }

        async function loadUserProfile() {
            try {
                // Fetch random user data from the API
                const response = await fetch('https://randomuser.me/api/');
                const data = await response.json();
                
                if (response.ok && data.results && data.results.length > 0) {
                    const user = data.results[0];
                    const name = `${user.name.first} ${user.name.last}`;
                    const handle = user.login.username;
                    const imageUrl = user.picture.large;
                    
                    userProfileContainer.innerHTML = `
                        <img src="${imageUrl}" alt="Your avatar" class="w-16 h-16 rounded-full ring-4 ring-blue-400">
                        <div class="flex-1">
                            <p class="text-xl font-bold text-gray-800">${name}</p>
                            <p class="text-md text-gray-500">@${handle}</p>
                        </div>
                    `;
                } else {
                    throw new Error('Failed to fetch user profile.');
                }
            } catch (error) {
                console.error("Error loading user profile:", error);
                userProfileContainer.innerHTML = `<p class="text-red-500">Error loading profile.</p>`;
            }
        }

        async function loadUsers() {
            connectBtnText.classList.add('hidden');
            connectSpinner.classList.remove('hidden');
            statusMessage.textContent = "Loading your followed accounts...";
            try {
                const response = await fetch(`/api/followed_users?user_id=${userId}`);
                const data = await response.json();
                
                if (response.ok) {
                    // Add mock data for the detailed information
                    const mockFollowers = [12345, 5432, 98765, 2345, 6789, 100000, 32109, 8765, 20123, 54321, 9876, 123456];
                    const mockTweetDates = ['1 day ago', '3 days ago', '1 week ago', '2 weeks ago', '1 month ago', '2 months ago', '3 months ago', '4 months ago', '5 months ago', '6 months ago', '1 year ago', '2 years ago'];
                    
                    followedUsers = data.users.map(user => {
                        // Add mock data to each user object
                        user.followers_count = mockFollowers[Math.floor(Math.random() * mockFollowers.length)];
                        user.last_tweet_date = mockTweetDates[Math.floor(Math.random() * mockTweetDates.length)];
                        return user;
                    });
                    
                    filterAndRenderUsers();
                    unfollowSection.classList.remove('hidden');
                    statusMessage.textContent = "Accounts loaded. Select to unfollow.";
                } else {
                    throw new Error(data.error || 'Failed to fetch users.');
                }
            } catch (error) {
                console.error("Error loading users:", error);
                statusMessage.textContent = `Error: ${error.message}`;
                unfollowSection.classList.add('hidden');
                connectBtn.classList.remove('hidden');
            } finally {
                connectBtnText.classList.remove('hidden');
                connectSpinner.classList.add('hidden');
            }
        }

        function filterAndRenderUsers() {
            // Get current search and sort values
            const searchText = searchInput.value.toLowerCase();
            const sortBy = sortSelect.value;
            
            // Filter users based on search input
            const filteredUsers = followedUsers.filter(user => 
                user.name.toLowerCase().includes(searchText) || user.handle.toLowerCase().includes(searchText)
            );

            // Sort filtered users
            filteredUsers.sort((a, b) => {
                switch (sortBy) {
                    case 'score-asc':
                        return a.score - b.score;
                    case 'score-desc':
                        return b.score - a.score;
                    case 'name-asc':
                        return a.name.localeCompare(b.name);
                    case 'name-desc':
                        return b.name.localeCompare(a.name);
                    default:
                        return 0;
                }
            });

            // Clear and re-render the list
            userListContainer.innerHTML = '';
            filteredUsers.forEach(user => renderUserCard(user));
            
            updateSelectedCount(); // Make sure the count is updated after re-rendering
        }

        function checkAuthStatus() {
            if (userId) {
                localStorage.setItem('twitter_user_id', userId);
                connectBtn.classList.add('hidden');
                infoSection.classList.add('hidden');
                testimonialsSection.classList.add('hidden');
                disconnectBtn.classList.remove('hidden');
                loadUserProfile();
                loadUsers();
            } else {
                connectBtn.classList.remove('hidden');
                infoSection.classList.remove('hidden');
                testimonialsSection.classList.remove('hidden');
                disconnectBtn.classList.add('hidden');
            }
        }

        connectBtn.addEventListener('click', async () => {
            connectBtnText.classList.add('hidden');
            connectSpinner.classList.remove('hidden');
            statusMessage.textContent = "Connecting to Twitter...";
            infoSection.classList.add('hidden'); // Hide info section on click
            testimonialsSection.classList.add('hidden'); // Hide testimonials on click
            try {
                const response = await fetch('/auth/twitter');
                const data = await response.json();
                
                if (response.ok && data.redirect_url) {
                    window.location.href = data.redirect_url;
                } else {
                    throw new Error(data.error || 'Failed to connect.');
                }
            } catch (error) {
                console.error("Error during connection:", error);
                statusMessage.textContent = `Error: ${error.message}`;
                infoSection.classList.remove('hidden'); // Show info section if connection fails
                testimonialsSection.classList.remove('hidden'); // Show testimonials if connection fails
            }
        });

        // Event listeners for sorting and searching
        searchInput.addEventListener('input', () => {
            if (searchInput.value.length > 0) {
                clearSearchBtn.classList.remove('hidden');
            } else {
                clearSearchBtn.classList.add('hidden');
            }
            filterAndRenderUsers();
        });

        clearSearchBtn.addEventListener('click', () => {
            searchInput.value = '';
            clearSearchBtn.classList.add('hidden');
            filterAndRenderUsers();
        });

        sortSelect.addEventListener('change', filterAndRenderUsers);

        selectAllCheckbox.addEventListener('change', (e) => {
            const isChecked = e.target.checked;
            document.querySelectorAll('.user-checkbox').forEach(checkbox => {
                checkbox.checked = isChecked;
            });
            updateSelectedCount();
        });

        userListContainer.addEventListener('change', (e) => {
            if (e.target.classList.contains('user-checkbox')) {
                updateSelectedCount();
                const allCheckboxes = document.querySelectorAll('.user-checkbox');
                const allChecked = [...allCheckboxes].every(checkbox => checkbox.checked);
                selectAllCheckbox.checked = allChecked;
            }
        });

        unfollowSelectedBtn.addEventListener('click', async () => {
            const selectedCards = [...document.querySelectorAll('.user-checkbox:checked')];
            if (selectedCards.length === 0) {
                statusMessage.textContent = "Please select at least one user to unfollow.";
                return;
            }

            modalUserList.innerHTML = '';
            selectedCards.forEach(card => {
                const userCard = card.closest('div.flex');
                const name = userCard.querySelector('p.font-semibold').textContent;
                const handle = userCard.querySelector('p.text-sm').textContent;
                const listItem = document.createElement('li');
                listItem.textContent = `${name} (${handle})`;
                modalUserList.appendChild(listItem);
            });
            
            unfollowModal.classList.remove('hidden');
        });

        modalCancelBtn.addEventListener('click', () => {
            unfollowModal.classList.add('hidden');
        });

        modalConfirmBtn.addEventListener('click', async () => {
            unfollowModal.classList.add('hidden');
            const selectedIds = [...document.querySelectorAll('.user-checkbox:checked')]
                .map(checkbox => parseInt(checkbox.dataset.id));
            
            statusMessage.textContent = `Unfollowing ${selectedIds.length} users...`;
            unfollowSelectedBtn.disabled = true;
            unfollowBtnText.classList.add('hidden');
            unfollowSpinner.classList.remove('hidden');

            try {
                const response = await fetch('/api/unfollow', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user_id: userId, unfollow_ids: selectedIds })
                });
                const data = await response.json();

                if (response.ok) {
                    // Update the in-memory array
                    followedUsers = followedUsers.filter(user => !selectedIds.includes(user.id));
                    filterAndRenderUsers(); // Re-render the list
                    
                    statusMessage.textContent = `Successfully unfollowed ${selectedIds.length} users.`;
                } else {
                    throw new Error(data.error || 'Failed to unfollow.');
                }
            } catch (error) {
                console.error("Error unfollowing users:", error);
                statusMessage.textContent = `Error: ${error.message}`;
            } finally {
                unfollowSelectedBtn.disabled = false;
                unfollowBtnText.classList.remove('hidden');
                unfollowSpinner.classList.add('hidden');
            }
        });

        disconnectBtn.addEventListener('click', async () => {
            statusMessage.textContent = "Disconnecting...";
            try {
                const response = await fetch('/api/disconnect', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user_id: userId })
                });
                const data = await response.json();
                if (response.ok) {
                    localStorage.removeItem('twitter_user_id');
                    userId = null;
                    unfollowSection.classList.add('hidden');
                    userListContainer.innerHTML = '';
                    checkAuthStatus();
                    statusMessage.textContent = "You have been disconnected.";
                } else {
                    throw new Error(data.error || 'Failed to disconnect.');
                }
            } catch (error) {
                console.error("Error disconnecting:", error);
                statusMessage.textContent = `Error: ${error.message}`;
            }
        });

        checkAuthStatus();

        // --- Interactive Background Script (Glowing Bubbles) ---
        const canvas = document.getElementById('interactive-bg-canvas');
        const ctx = canvas.getContext('2d');
        const bubbles = [];
        const numBubbles = 20;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            bubbles.length = 0; // Clear existing bubbles
            for (let i = 0; i < numBubbles; i++) {
                bubbles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: Math.random() * 50 + 20,
                    vx: (Math.random() - 0.5) * 1.5,
                    vy: (Math.random() - 0.5) * 1.5,
                    color: `hsl(${Math.random() * 360}, 70%, 70%)`,
                });
            }
        }

        function drawBubbles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            bubbles.forEach(b => {
                ctx.beginPath();
                ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
                ctx.fillStyle = b.color;
                ctx.shadowColor = b.color;
                ctx.shadowBlur = 20;
                ctx.globalAlpha = 0.6;
                ctx.fill();
                ctx.shadowBlur = 0;
            });
        }

        function animate() {
            requestAnimationFrame(animate);
            drawBubbles();
            bubbles.forEach(b => {
                b.x += b.vx;
                b.y += b.vy;

                // Bounce off edges
                if (b.x + b.radius > canvas.width || b.x - b.radius < 0) {
                    b.vx *= -1;
                }
                if (b.y + b.radius > canvas.height || b.y - b.radius < 0) {
                    b.vy *= -1;
                }
            });
        }

        window.addEventListener('resize', resizeCanvas);
        window.onload = () => {
            resizeCanvas();
            animate();
        };