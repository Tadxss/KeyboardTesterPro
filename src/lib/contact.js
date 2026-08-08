const WEB3FORMS_ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

export async function submitContactForm({ name, email, message }) {
  const res = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      access_key: WEB3FORMS_ACCESS_KEY,
      name,
      email,
      message,
      subject: `Keyboard Tester Pro — Message from ${name}`,
    }),
  });
  const data = await res.json();
  return data.success === true;
}
