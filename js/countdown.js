// Countdown timer functionality
document.addEventListener('DOMContentLoaded', function() {
    function updateCountdown() {
        const countdowns = document.querySelectorAll('.countdown');
        
        countdowns.forEach(countdown => {
            let hours = countdown.querySelector('.hours');
            let minutes = countdown.querySelector('.minutes');
            let seconds = countdown.querySelector('.seconds');
            
            // This is just for demo - in a real app you would calculate time remaining
            let h = parseInt(hours.textContent);
            let m = parseInt(minutes.textContent);
            let s = parseInt(seconds.textContent);
            
            s--;
            
            if (s < 0) {
                s = 59;
                m--;
            }
            
            if (m < 0) {
                m = 59;
                h--;
            }
            
            if (h < 0) {
                h = 23;
            }
            
            hours.textContent = h.toString().padStart(2, '0');
            minutes.textContent = m.toString().padStart(2, '0');
            seconds.textContent = s.toString().padStart(2, '0');
        });
    }
    
    setInterval(updateCountdown, 1000);
});