/* ============================================================
   Quote Form — Supabase Integration
   Submits contact form to Supabase quotes table
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('quoteForm');
  if (!form) return;

  // Load Supabase JS client
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js';
  script.onload = initForm;
  document.head.appendChild(script);

  function initForm() {
    const { createClient } = window.supabase;
    const db = createClient(SUPABASE_URL, SUPABASE_ANON);

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.textContent;

      // Loading state
      btn.textContent = 'Sending…';
      btn.disabled = true;
      btn.style.opacity = '0.7';

      // Gather form data
      const data = {
        first_name : form.fname.value.trim(),
        last_name  : form.lname.value.trim(),
        email      : form.email.value.trim(),
        phone      : form.phone.value.trim()   || null,
        company    : form.company.value.trim() || null,
        service    : form.service.value        || null,
        message    : form.message.value.trim() || null,
      };

      const { error } = await db.from('quotes').insert([data]);

      if (error) {
        // Error state
        btn.textContent = '✕ Something went wrong — please call us';
        btn.style.background = '#b71c1c';
        btn.style.color = '#fff';
        btn.disabled = false;
        btn.style.opacity = '1';
        console.error('Supabase error:', error.message);
      } else {
        // Success state
        btn.textContent = '✓ Sent! We\'ll be in touch shortly.';
        btn.style.background = '#1b5e20';
        btn.style.color = '#fff';
        btn.style.opacity = '1';

        // Show success message
        const msg = document.createElement('div');
        msg.style.cssText = `
          margin-top:1rem;
          padding:1rem 1.25rem;
          background:rgba(27,94,32,0.08);
          border:1px solid rgba(27,94,32,0.3);
          border-left:3px solid #2e7d32;
          font-size:13px;
          color:#1b5e20;
          font-family:'DM Sans',sans-serif;
        `;
        msg.innerHTML = `
          <strong>Thank you, ${data.first_name}!</strong><br>
          Your quote request has been received. Our team will contact you within a few hours.<br>
          <span style="opacity:0.7">For urgent enquiries call <a href="tel:+97126587770" style="color:#1b5e20;font-weight:600">+971 2 658 7770</a></span>
        `;
        form.appendChild(msg);
        form.reset();
      }
    });
  }
});
