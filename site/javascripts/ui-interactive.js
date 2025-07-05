document.addEventListener('DOMContentLoaded', function() {
  // Dark mode toggle (site-wide)

  // Demo toggle (example for other toggles)
  const demoToggle = document.getElementById('demo-toggle');
  if (demoToggle) {
    demoToggle.addEventListener('change', function() {
      alert('Toggle switched: ' + (demoToggle.checked ? 'ON' : 'OFF'));
      // Add your custom logic here
    });
  }
});