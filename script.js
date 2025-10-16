const situationInput = document.getElementById('situation-input');
const toneSelect = document.getElementById('tone-select');
const generateBtn = document.getElementById('generate-btn');
const resultContainer = document.getElementById('result-container');
const generatedMessage = document.getElementById('generated-message');
const copyBtn = document.getElementById('copy-btn');
const loading = document.getElementById('loading');
const errorMessage = document.getElementById('error-message');

generateBtn.addEventListener('click', async () => {
    const situation = situationInput.value.trim();
    const tone = toneSelect.value;

    if (!situation) {
        showError('অনুগ্রহ করে পরিস্থিতি বা উদ্দেশ্য লিখুন');
        return;
    }

    hideError();
    resultContainer.classList.add('hidden');
    loading.classList.remove('hidden');
    generateBtn.disabled = true;

    try {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ situation, tone }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'বার্তা তৈরি করতে সমস্যা হয়েছে');
        }

        const data = await response.json();
        displayMessage(data.message);
    } catch (error) {
        showError(error.message || 'বার্তা তৈরি করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
        loading.classList.add('hidden');
        generateBtn.disabled = false;
    }
});

copyBtn.addEventListener('click', async () => {
    const text = generatedMessage.textContent;
    
    try {
        await navigator.clipboard.writeText(text);
        const originalHTML = copyBtn.innerHTML;
        
        copyBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.6667 5L7.50004 14.1667L3.33337 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>কপি হয়েছে!</span>
        `;
        copyBtn.classList.add('copied');
        
        setTimeout(() => {
            copyBtn.innerHTML = originalHTML;
            copyBtn.classList.remove('copied');
        }, 2000);
    } catch (error) {
        showError('কপি করতে সমস্যা হয়েছে');
    }
});

function displayMessage(message) {
    generatedMessage.textContent = message;
    resultContainer.classList.remove('hidden');
    resultContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
    setTimeout(() => {
        hideError();
    }, 5000);
}

function hideError() {
    errorMessage.classList.add('hidden');
}

