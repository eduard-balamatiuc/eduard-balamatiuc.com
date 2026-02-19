const starredDispatches = [
  "setting-up-ubuntu-server-on-intel-mac-minis",
];

document.addEventListener('DOMContentLoaded', () => {
  // Load user-starred items from localStorage
  const localStorageKey = 'user-starred-dispatches';
  let userStarred = JSON.parse(localStorage.getItem(localStorageKey) || '[]');

  // Apply starred state on page load
  document.querySelectorAll('.post-star').forEach(starCell => {
    const dispatchId = starCell.dataset.dispatchId;
    const starIcon = starCell.querySelector('svg');
    
    if (!dispatchId || !starIcon) return;
    
    // Check if this is a default starred item (gold and untoggable)
    if (starredDispatches.includes(dispatchId)) {
      starIcon.classList.remove('star-empty');
      starIcon.classList.add('star-filled', 'default-star');
    }
    // Check if this item is in user-starred list (text color and toggable)
    else if (userStarred.includes(dispatchId)) {
      starIcon.classList.remove('star-empty');
      starIcon.classList.add('star-filled', 'user-starred');
    }
  });

  // Toggle starred state when clicking
  document.querySelectorAll('.star-toggle').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      
      const starCell = button.closest('.post-star');
      const dispatchId = starCell?.dataset.dispatchId;
      const starIcon = button.querySelector('svg');
      
      if (!dispatchId || !starIcon) return;
      
      // Skip default starred items (they can't be toggled)
      if (starredDispatches.includes(dispatchId)) return;
      
      // Toggle starred state
      if (userStarred.includes(dispatchId)) {
        // Remove from starred
        userStarred = userStarred.filter(item => item !== dispatchId);
        starIcon.classList.remove('star-filled', 'user-starred');
        starIcon.classList.add('star-empty');
      } else {
        // Add to starred
        userStarred.push(dispatchId);
        starIcon.classList.remove('star-empty');
        starIcon.classList.add('star-filled', 'user-starred');
      }
      
      // Save to localStorage
      localStorage.setItem(localStorageKey, JSON.stringify(userStarred));
    });
  });
});
