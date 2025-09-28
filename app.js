// Professional Presentation Application JavaScript
class PresentationController {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = 13;
        this.slides = document.querySelectorAll('.slide');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.slideCounter = document.getElementById('slideCounter');
        
        this.init();
    }

    init() {
        // Initialize event listeners
        this.setupEventListeners();
        
        // Set initial state
        this.updateSlideDisplay();
        this.updateNavigationState();
        
        // Add keyboard navigation
        this.setupKeyboardNavigation();
        
        console.log('Presentation initialized with', this.totalSlides, 'slides');
    }

    setupEventListeners() {
        // Navigation button event listeners
        this.prevBtn.addEventListener('click', () => this.previousSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Touch/swipe support for mobile
        this.setupTouchNavigation();
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (event) => {
            switch(event.key) {
                case 'ArrowRight':
                case ' ': // Spacebar
                case 'PageDown':
                    event.preventDefault();
                    this.nextSlide();
                    break;
                    
                case 'ArrowLeft':
                case 'PageUp':
                    event.preventDefault();
                    this.previousSlide();
                    break;
                    
                case 'Home':
                    event.preventDefault();
                    this.goToSlide(1);
                    break;
                    
                case 'End':
                    event.preventDefault();
                    this.goToSlide(this.totalSlides);
                    break;
                    
                case 'Escape':
                    event.preventDefault();
                    this.toggleFullscreen();
                    break;
            }
        });
    }

    setupTouchNavigation() {
        let startX = 0;
        let startY = 0;
        const minSwipeDistance = 50;

        document.addEventListener('touchstart', (event) => {
            startX = event.touches[0].clientX;
            startY = event.touches[0].clientY;
        }, { passive: true });

        document.addEventListener('touchend', (event) => {
            const endX = event.changedTouches[0].clientX;
            const endY = event.changedTouches[0].clientY;
            
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            
            // Check if horizontal swipe is dominant and meets minimum distance
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
                if (deltaX > 0) {
                    // Swipe right - go to previous slide
                    this.previousSlide();
                } else {
                    // Swipe left - go to next slide
                    this.nextSlide();
                }
            }
        }, { passive: true });
    }

    nextSlide() {
        if (this.currentSlide < this.totalSlides) {
            this.goToSlide(this.currentSlide + 1);
        }
    }

    previousSlide() {
        if (this.currentSlide > 1) {
            this.goToSlide(this.currentSlide - 1);
        }
    }

    goToSlide(slideNumber) {
        if (slideNumber < 1 || slideNumber > this.totalSlides) {
            return;
        }

        // Hide current slide
        this.slides[this.currentSlide - 1].classList.remove('active');
        
        // Update current slide number
        this.currentSlide = slideNumber;
        
        // Show new slide
        this.slides[this.currentSlide - 1].classList.add('active');
        
        // Update UI
        this.updateSlideDisplay();
        this.updateNavigationState();
        
        // Scroll to top of slide content
        const activeSlide = this.slides[this.currentSlide - 1];
        const slideContent = activeSlide.querySelector('.slide-content');
        if (slideContent) {
            slideContent.scrollTop = 0;
        }
        
        console.log(`Navigated to slide ${this.currentSlide}`);
    }

    updateSlideDisplay() {
        this.slideCounter.textContent = `${this.currentSlide} / ${this.totalSlides}`;
    }

    updateNavigationState() {
        // Update previous button state
        this.prevBtn.disabled = this.currentSlide === 1;
        
        // Update next button state
        this.nextBtn.disabled = this.currentSlide === this.totalSlides;
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    }

    // Utility method to get current slide information
    getCurrentSlideInfo() {
        const currentSlideElement = this.slides[this.currentSlide - 1];
        const title = currentSlideElement.querySelector('.slide-title, .presentation-title')?.textContent || 'Title Slide';
        
        return {
            slideNumber: this.currentSlide,
            totalSlides: this.totalSlides,
            title: title,
            element: currentSlideElement
        };
    }

    // Method to add slide transition effects
    addTransitionEffect(slide, direction = 'forward') {
        slide.style.opacity = '0';
        slide.style.transform = direction === 'forward' ? 'translateX(30px)' : 'translateX(-30px)';
        
        // Force reflow
        slide.offsetHeight;
        
        // Animate in
        slide.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        slide.style.opacity = '1';
        slide.style.transform = 'translateX(0)';
    }

    // Method for presentation mode keyboard shortcuts
    setupPresentationMode() {
        document.addEventListener('keydown', (event) => {
            // Additional presentation shortcuts
            if (event.key === 'b' || event.key === 'B') {
                // Black screen toggle
                this.toggleBlackScreen();
            }
            
            if (event.key === 'w' || event.key === 'W') {
                // White screen toggle
                this.toggleWhiteScreen();
            }
            
            if (event.ctrlKey && event.key === 'p') {
                // Print presentation
                event.preventDefault();
                this.printPresentation();
            }
        });
    }

    toggleBlackScreen() {
        const blackScreen = document.getElementById('blackScreen');
        if (!blackScreen) {
            const screen = document.createElement('div');
            screen.id = 'blackScreen';
            screen.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: black;
                z-index: 9999;
                display: none;
            `;
            document.body.appendChild(screen);
        }
        
        const screen = document.getElementById('blackScreen');
        screen.style.display = screen.style.display === 'none' ? 'block' : 'none';
    }

    toggleWhiteScreen() {
        const whiteScreen = document.getElementById('whiteScreen');
        if (!whiteScreen) {
            const screen = document.createElement('div');
            screen.id = 'whiteScreen';
            screen.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: white;
                z-index: 9999;
                display: none;
            `;
            document.body.appendChild(screen);
        }
        
        const screen = document.getElementById('whiteScreen');
        screen.style.display = screen.style.display === 'none' ? 'block' : 'none';
    }

    printPresentation() {
        // Create a print-friendly version
        const printWindow = window.open('', '_blank');
        const printContent = this.generatePrintContent();
        
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Presentation - Technology, Automation, and AI in Medication Administration</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    .print-slide { page-break-after: always; margin-bottom: 40px; }
                    .print-slide:last-child { page-break-after: avoid; }
                    h1 { color: #2D7A8A; border-bottom: 2px solid #2D7A8A; padding-bottom: 10px; }
                    h2 { color: #2D7A8A; }
                    ul { margin-left: 20px; }
                    li { margin-bottom: 5px; }
                    .stat-highlight { background: #2D7A8A; color: white; padding: 2px 6px; border-radius: 3px; }
                </style>
            </head>
            <body>${printContent}</body>
            </html>
        `);
        
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    }

    generatePrintContent() {
        let content = '';
        this.slides.forEach((slide, index) => {
            const title = slide.querySelector('.slide-title, .presentation-title')?.textContent || `Slide ${index + 1}`;
            const slideContent = slide.querySelector('.slide-content').innerHTML;
            content += `<div class="print-slide"><h1>${title}</h1>${slideContent}</div>`;
        });
        return content;
    }
}

// Speaker Notes functionality
class SpeakerNotes {
    constructor() {
        this.notes = this.initializeNotes();
    }

    initializeNotes() {
        return {
            1: "Welcome everyone to our presentation on Technology, Automation, and AI in Medication Administration. We are Group 1, and today we'll explore how cutting-edge technology is revolutionizing patient safety in healthcare settings.",
            
            2: "Our agenda covers the key technologies transforming medication administration. We'll examine smart infusion pumps, AI-powered decision support systems, and automated dispensing systems, followed by practical applications, benefits, challenges, and future perspectives.",
            
            3: "The statistics are alarming - medication errors cause over 4,000 preventable injuries per hospital annually. With IV medication errors affecting 60% of patients and economic costs reaching $42 billion worldwide, the need for technological solutions is critical.",
            
            4: "Smart infusion pumps represent a major advancement with integrated safety features including Dose Error Reduction Software and built-in drug libraries. With 89.5% adoption in U.S. hospitals, these systems are becoming the standard of care.",
            
            5: "AI-powered clinical decision support systems use machine learning for drug interaction detection with up to 90% accuracy. These systems provide predictive analytics, natural language processing, and real-time risk stratification.",
            
            6: "Automated pharmacy dispensing systems include robotic dispensing, automated cabinets, and unit-dose packaging. These systems can automate over 50% of daily prescriptions with dispensing speeds of 12+ medications per minute.",
            
            7: "Practical applications span hospital settings including ICU medication administration, emergency departments, oncology, and pediatric care. Community pharmacy applications include automated filling, therapy management, and adherence monitoring.",
            
            8: "The demonstrated benefits are substantial: 70-80% reduction in medication administration errors, prevention of 300+ adverse events per ICU annually, and 50% reduction in medication turnaround time. Economic benefits include ROI within 12 months.",
            
            9: "Implementation challenges include alert fatigue, drug library maintenance, integration complexities, and staff training requirements. Workflow barriers include bypassing safety systems and resistance to culture change.",
            
            10: "Now we'll watch video demonstrations showing smart pump programming, automated dispensing systems in action, and AI-powered medication management platforms. These videos demonstrate real-world applications of the technologies we've discussed.",
            
            11: "Future innovations include closed-loop systems, predictive analytics for adverse events, personalized dosing based on genetic profiles, and blockchain for medication tracking. The global smart pumps market is expected to reach $2.4B by 2028.",
            
            12: "In summary, technology significantly reduces medication errors through synergistic smart pumps, AI systems, and automation. Success requires comprehensive training, leadership commitment, and continuous optimization with evidence-based implementation strategies.",
            
            13: "Let's discuss three critical questions: the ethical implications of AI predicting non-adherence, implementation strategy choices between smart pumps and automated dispensing, and the future role of pharmacists in fully automated systems. What are your thoughts?"
        };
    }

    getNotesForSlide(slideNumber) {
        return this.notes[slideNumber] || `Speaker notes for slide ${slideNumber} - discuss key points and engage with the audience.`;
    }

    displayNotes(slideNumber) {
        console.log(`Speaker Notes for Slide ${slideNumber}:`);
        console.log(this.getNotesForSlide(slideNumber));
    }
}

// Initialize the presentation when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing Technology & AI in Medication Administration Presentation...');
    
    // Initialize presentation controller
    window.presentationController = new PresentationController();
    
    // Initialize speaker notes
    window.speakerNotes = new SpeakerNotes();
    
    // Setup additional presentation features
    window.presentationController.setupPresentationMode();
    
    // Add slide change listener for speaker notes
    const originalGoToSlide = window.presentationController.goToSlide.bind(window.presentationController);
    window.presentationController.goToSlide = function(slideNumber) {
        originalGoToSlide(slideNumber);
        window.speakerNotes.displayNotes(slideNumber);
    };
    
    // Display initial speaker notes
    window.speakerNotes.displayNotes(1);
    
    console.log('Presentation ready! Use arrow keys or buttons to navigate.');
    console.log('Keyboard shortcuts:');
    console.log('- Arrow keys: Navigate slides');
    console.log('- Spacebar: Next slide');
    console.log('- Home/End: Go to first/last slide');
    console.log('- Escape: Toggle fullscreen');
    console.log('- B: Black screen toggle');
    console.log('- W: White screen toggle');
    console.log('- Ctrl+P: Print presentation');
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PresentationController, SpeakerNotes };
}