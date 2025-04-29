const defaultStarredTitles = [];
document.querySelectorAll('.star-filled.default-star').forEach(starIcon => {
  const title = starIcon.closest('.post-star').dataset.title;
  if (title) defaultStarredTitles.push(title);
});

// Load user-starred items from localStorage
const localStorageKey = 'user-starred-dispatches';
let userStarred = JSON.parse(localStorage.getItem(localStorageKey) || '[]');

// Apply user starred state on page load
function applyStarredState() {
  document.querySelectorAll('.post-star').forEach(starCell => {
    const title = starCell.dataset.title;
    const starIcon = starCell.querySelector('svg');
    
    if (!title || !starIcon) return;
    
    // Check if this item is in user-starred list
    if (userStarred.includes(title)) {
      starIcon.classList.remove('star-empty');
      starIcon.classList.add('star-filled', 'user-starred');
    }
  });
}

// Toggle starred state when clicking
function setupStarToggle() {
  document.querySelectorAll('.star-toggle').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      
      const starCell = button.closest('.post-star');
      const title = starCell?.dataset.title;
      const starIcon = button.querySelector('svg');
      
      if (!title || !starIcon) return;
      
      // Skip default starred items (they can't be toggled)
      if (defaultStarredTitles.includes(title)) return;
      
      // Toggle starred state
      if (userStarred.includes(title)) {
        // Remove from starred
        userStarred = userStarred.filter(item => item !== title);
        starIcon.classList.remove('star-filled', 'user-starred');
        starIcon.classList.add('star-empty');
      } else {
        // Add to starred
        userStarred.push(title);
        starIcon.classList.remove('star-empty');
        starIcon.classList.add('star-filled', 'user-starred');
      }
      
      // Save to localStorage
      localStorage.setItem(localStorageKey, JSON.stringify(userStarred));
    });
  });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  applyStarredState();
  setupStarToggle();
});