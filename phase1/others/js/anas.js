
<script>
    // Toggle expand/collapse functionality
    const toggleButton = document.getElementById('toggle-expand');
    const expandIcon = document.getElementById('expand-icon');
    const collapseIcon = document.getElementById('collapse-icon');
    const expandableSection = document.getElementById('expandable-section');
    
    toggleButton.addEventListener('click', function() {
        const isExpanded = expandableSection.style.display === 'block';
        expandableSection.style.display = isExpanded ? 'none' : 'block';
        expandIcon.style.display = isExpanded ? 'block' : 'none';
        collapseIcon.style.display = isExpanded ? 'none' : 'block';
    });

    // Clear button functionality for College input
    const collegeInput = document.getElementById('college-input');
    const clearCollegeButton = document.getElementById('clear-college');
    
    collegeInput.addEventListener('input', function() {
        clearCollegeButton.style.display = this.value ? 'block' : 'none';
    });
    
    clearCollegeButton.addEventListener('click', function() {
        collegeInput.value = '';
        this.style.display = 'none';
    });

    // Clear button functionality for Keyword input
    const keywordInput = document.getElementById('keyword-input');
    const clearKeywordButton = document.getElementById('clear-keyword');
    
    keywordInput.addEventListener('input', function() {
        clearKeywordButton.style.display = this.value ? 'block' : 'none';
    });
    
    clearKeywordButton.addEventListener('click', function() {
        keywordInput.value = '';
        this.style.display = 'none';
    });

    // Campus selection functionality
    const campusButtons = document.querySelectorAll('.campus-button');
    
    campusButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove selected class from all buttons
            campusButtons.forEach(btn => btn.classList.remove('selected'));
            // Add selected class to clicked button
            this.classList.add('selected');
        });
    });
    
</script>
