# How to Connect Your Custom Domain

## Quick Answer
Yes! You can connect your own domain (like heicconverter.com) to your Emergent deployment. It's included free - no extra cost!

## Step-by-Step Setup

### 1. Deploy Your Application First
- Make sure your app is deployed and working on the Emergent URL
- Test it in preview mode to ensure everything works

### 2. Start Domain Connection
1. Go to your deployment dashboard on Emergent
2. Click **"Link domain"** button
3. Type your domain name (e.g., `heicconverter.com` or `app.heicconverter.com`)
4. Click **"Entri"**
5. Follow the on-screen instructions

### 3. Configure DNS Settings

**IMPORTANT: Remove All A Records First**
- Go to your domain provider (GoDaddy, Namecheap, Cloudflare, etc.)
- Find DNS settings
- **Delete ALL existing A records** (this is critical!)
- Follow the specific instructions shown by Entri

#### Common Domain Providers:
- **GoDaddy**: DNS Management → Manage DNS → Remove A records
- **Namecheap**: Domain List → Manage → Advanced DNS → Remove A records
- **Cloudflare**: DNS → Remove A records
- **Google Domains**: DNS → Custom records → Remove A records

### 4. Wait for Propagation
- DNS changes take **5-15 minutes** typically
- Sometimes up to **24 hours** globally
- Your domain should be live within 15 minutes in most cases

### 5. Verify It's Working
Visit your custom domain in a browser:
- `https://yourdomain.com` (automatically HTTPS!)
- You should see your HEIC converter

## Troubleshooting

### Domain Not Working After 15 Minutes?

**Check DNS Settings:**
1. Log into your domain provider
2. Go to DNS settings
3. Make sure ALL A records are removed
4. Look for these common issues:
   - Old A records still present
   - CNAME conflicts
   - Proxy/CDN settings interfering

**Re-link Domain:**
1. Go back to Emergent dashboard
2. Click "Entri" again
3. Follow instructions carefully
4. Wait another 15 minutes

### Check DNS Propagation Status
Use these free tools:
- https://dnschecker.org
- https://whatsmydns.net
- Enter your domain to see propagation status worldwide

## Features You Get

✅ **Free SSL/HTTPS**
- Automatically provided
- Secure connection (padlock in browser)
- No configuration needed

✅ **Custom Domain Included**
- No extra monthly cost
- Part of your 50 credits/month deployment

✅ **Subdomain Support**
- Can use `app.yourdomain.com`
- Or root domain `yourdomain.com`
- Or both!

## Common Scenarios

### Scenario 1: New Domain
If you just bought a domain:
1. Wait 1-2 hours for domain registration to complete
2. Follow setup steps above
3. Should work quickly

### Scenario 2: Existing Website
If domain currently points to another website:
1. Remove old A records
2. Add new DNS records from Entri
3. Old site will go down
4. Your new HEIC converter will be live

### Scenario 3: Using Subdomain
Want to keep main site and add app on subdomain?
1. Use subdomain like `convert.yourdomain.com`
2. Only that subdomain points to Emergent
3. Main domain stays with existing site

## Domain Provider Specific Tips

### GoDaddy
- Navigate to: My Products → Domains → DNS
- Click "Manage" next to your domain
- Remove all A records in the "Records" section

### Namecheap
- Go to Domain List → Manage
- Click "Advanced DNS" tab
- Remove all A records from "Host Records"

### Cloudflare
- Select your domain
- Go to DNS tab
- Remove A records
- **Important**: Turn OFF Orange Cloud (proxy) during setup

### Google Domains
- Go to My Domains
- Click DNS on the left
- Scroll to Custom Records
- Remove all A records

## Timeline

| Step | Time |
|------|------|
| Deploy app | 1 minute |
| Link domain in Emergent | 2 minutes |
| Configure DNS | 5 minutes |
| DNS propagation | 5-15 minutes |
| **Total** | **~15-25 minutes** |

## SEO Considerations

### After Connecting Custom Domain:

**Update Your Google Search Console:**
1. Add your custom domain as a new property
2. Verify ownership (auto-verified with DNS)
3. Submit sitemap if you have one

**Update Social Media:**
- Update links on Facebook, Twitter, etc.
- Share your new domain

**301 Redirects (Optional):**
- If you had an old domain, set up redirects
- Or just promote the new domain

## Cost Summary

| Item | Cost |
|------|------|
| Custom domain connection | FREE ✅ |
| SSL certificate | FREE ✅ |
| Domain name (from registrar) | ~$10-15/year |
| Emergent deployment | 50 credits/month |

## Multiple Domains

Can you connect multiple domains?
- Yes! Set up each one through the "Link domain" process
- Example: Both `heicconverter.com` AND `www.heicconverter.com`
- Both will point to same app

## Email with Custom Domain

**Note:** This just connects your domain to the app, not email.

To get email (like support@yourdomain.com):
- Use your domain provider's email service
- Or use Google Workspace (~$6/month)
- Or use free email forwarding from your registrar

## Need Help?

Common questions:
- "My domain shows an error" → Check DNS records are correct
- "It's been 24 hours and not working" → Contact Emergent support
- "Can I use a domain I already have?" → Yes! Just follow steps above
- "Do I need to buy domain from Emergent?" → No, use any registrar

## Quick Checklist

Before setting up custom domain:
- [ ] App is deployed and working
- [ ] You own the domain name
- [ ] You have access to DNS settings
- [ ] You've tested app on Emergent URL
- [ ] You're ready to point domain to Emergent

During setup:
- [ ] Clicked "Link domain" in Emergent
- [ ] Followed Entri instructions
- [ ] Removed ALL A records from DNS
- [ ] Added required DNS records

After setup:
- [ ] Waited 15 minutes
- [ ] Tested domain in browser
- [ ] Verified HTTPS works
- [ ] Updated marketing materials

## Success!

Once your domain is connected:
- Share it: `https://yourdomain.com`
- Professional URL for your business
- Easy to remember for customers
- Great for SEO and branding

Your HEIC converter is now on your own domain! 🎉
