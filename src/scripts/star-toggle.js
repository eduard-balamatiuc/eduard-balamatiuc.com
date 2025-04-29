const starredDispatches = [
  "So how the deployment happened?",
];

document.addEventListener('DOMContentLoaded', () => {
  // Load user-starred items from localStorage
  const localStorageKey = 'user-starred-dispatches';
  let userStarred = JSON.parse(localStorage.getItem(localStorageKey) || '[]');

  // Apply starred state on page load
  document.querySelectorAll('.post-star').forEach(starCell => {
    const title = starCell.dataset.title;
    const starIcon = starCell.querySelector('svg');
    
    if (!title || !starIcon) return;
    
    // Check if this is a default starred item (gold and untoggable)
    if (starredDispatches.includes(title)) {
      starIcon.classList.remove('star-empty');
      starIcon.classList.add('star-filled', 'default-star');
    }
    // Check if this item is in user-starred list (text color and toggable)
    else if (userStarred.includes(title)) {
      starIcon.classList.remove('star-empty');
      starIcon.classList.add('star-filled', 'user-starred');
    }
  });

  // Toggle starred state when clicking
  document.querySelectorAll('.star-toggle').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      
      const starCell = button.closest('.post-star');
      const title = starCell?.dataset.title;
      const starIcon = button.querySelector('svg');
      
      if (!title || !starIcon) return;
      
      // Skip default starred items (they can't be toggled)
      if (starredDispatches.includes(title)) return;
      
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
});