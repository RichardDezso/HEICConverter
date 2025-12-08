# 🎯 Google AdSense Setup Guide

## Why Ads Aren't Showing

Your AdSense code is installed, but ads aren't displaying because:

1. ❌ **No Ad Units Created** - Only Auto Ads script is present
2. ❌ **Auto Ads Not Approved** - Can take 1-2 weeks for Google to review
3. ❌ **No Manual Ad Placements** - Need to add ad slots to pages
4. ❌ **New Site** - Google may still be evaluating content

---

## 🚀 How to Get Ads Showing

### Step 1: Verify AdSense Account Status

1. Go to https://adsense.google.com
2. Check your account status:
   - **Active** ✅ - You can create ad units
   - **Under Review** ⏳ - Wait for approval (1-2 weeks)
   - **Not Approved** ❌ - Fix issues mentioned by Google

### Step 2: Create Ad Units

Once approved, create ad units:

1. **Login to AdSense**
2. Go to **Ads** → **By ad unit**
3. Click **Display ads**
4. Create these ad units:

**Recommended Ad Units:**

**1. Homepage Display Ad**
- Name: "Homepage - Above FAQ"
- Type: Display
- Size: Responsive
- Copy the **Ad Slot ID** (e.g., `1234567890`)

**2. Blog Post In-Article Ad**
- Name: "Blog - In-Article"
- Type: In-article
- Copy the **Ad Slot ID**

**3. Sidebar Ad (Optional)**
- Name: "Blog - Sidebar"  
- Type: Display
- Size: Vertical
- Copy the **Ad Slot ID**

### Step 3: Add Ad Slot IDs to Your Site

Once you have ad slot IDs, update your code:

**In `/app/frontend/src/App.js`:**

Find this line:
```jsx
<DisplayAd slot="YOUR_AD_SLOT_ID" className="mb-12" />
```

Replace with your actual slot ID:
```jsx
<DisplayAd slot="1234567890" className="mb-12" />
```

### Step 4: Add More Ad Placements

You can add ads to multiple locations:

**Homepage (App.js):**
```jsx
// Above FAQ section
<DisplayAd slot="YOUR_SLOT_ID" className="mb-12" />

// Below converter tool
<DisplayAd slot="YOUR_SLOT_ID" className="mt-12" />
```

**Blog Posts (BlogPost.js):**
```jsx
import { InArticleAd } from '@/components/AdUnit';

// Inside blog post content
<InArticleAd slot="YOUR_SLOT_ID" className="my-8" />
```

**Blog List (Blog.js):**
```jsx
import { DisplayAd } from '@/components/AdUnit';

// Between blog posts
<DisplayAd slot="YOUR_SLOT_ID" className="my-8" />
```

---

## 📍 Best Ad Placements for Your Site

### Homepage
1. **Above the fold** - Below hero, before converter
2. **Mid-page** - After "How It Works" section
3. **Above FAQ** - Already added!
4. **Below FAQ** - Before footer

### Blog Posts
1. **In-Article** - After 2nd paragraph
2. **Mid-Article** - After 50% of content
3. **Below Article** - Before related posts

### Blog List Page
1. **Top of page** - Below header
2. **Between posts** - After every 3 posts
3. **Sidebar** - If you add a sidebar later

---

## 🎨 Ad Component Usage

I've created these components for you:

### 1. `<DisplayAd />`
General purpose responsive ad
```jsx
import { DisplayAd } from '@/components/AdUnit';

<DisplayAd slot="1234567890" className="my-8" />
```

### 2. `<InArticleAd />`
For blog posts (blends with content)
```jsx
import { InArticleAd } from '@/components/AdUnit';

<InArticleAd slot="1234567890" className="my-8" />
```

### 3. `<BannerAd />`
Horizontal banner (top/bottom of page)
```jsx
import { BannerAd } from '@/components/AdUnit';

<BannerAd slot="1234567890" />
```

### 4. `<SidebarAd />`
Vertical sidebar ad
```jsx
import { SidebarAd } from '@/components/AdUnit';

<SidebarAd slot="1234567890" />
```

---

## ⚙️ Current Setup

**What's Already Installed:**

✅ AdSense script in `<head>`
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8786338957589056"
     crossorigin="anonymous"></script>
```

✅ Publisher ID: `ca-pub-8786338957589056`

✅ Ad components created: `/app/frontend/src/components/AdUnit.js`

✅ First ad placement added: Homepage (above FAQ)

**What You Need to Do:**

1. ⏳ Wait for AdSense approval (if not approved yet)
2. 📝 Create ad units in AdSense dashboard
3. 🔑 Get ad slot IDs
4. 💻 Replace `YOUR_AD_SLOT_ID` with real IDs
5. 🚀 Deploy

---

## 🧪 Testing Ads

### Development (localhost)
- Ads show as **placeholders** with gray border
- Text: "Ad Placeholder (AdSense)"
- This prevents invalid clicks during development

### Production (after deployment)
- Real ads will appear
- May take a few hours for ads to start showing
- Google needs to crawl and understand your content

---

## ⏱️ Timeline

**Week 1:**
- Apply for AdSense (if new)
- Add code to site
- Submit for review

**Week 2-3:**
- Wait for approval
- Google reviews content
- Check email for approval notice

**Week 4:**
- Create ad units
- Add slot IDs to code
- Deploy
- Ads start showing within 24 hours

---

## 💰 Expected Revenue

For a new site like yours:

**Month 1-3:**
- Low traffic = Low revenue
- Focus on content & SEO
- Expect: $1-10/month

**Month 4-6:**
- Traffic growing
- More content indexed
- Expect: $10-50/month

**Month 7-12:**
- Established site
- Regular traffic
- Expect: $50-500+/month

**Factors:**
- Traffic volume (visitors/day)
- Content quality
- Ad placement
- Niche (HEIC conversion is tech-related, decent CPM)
- Geographic location of visitors

---

## 📊 Optimization Tips

### Increase Ad Revenue:

1. **More Content** - 20+ blog posts
2. **Better SEO** - Rank for keywords
3. **Quality Traffic** - Target tech-savvy users
4. **Ad Placement** - Test different locations
5. **Page Speed** - Fast loading = better ad performance

### Don't Do This:

❌ Click your own ads (account termination)
❌ Ask others to click ads
❌ Too many ads (bad user experience)
❌ Hide ads or misleading placement
❌ Invalid traffic sources

---

## 🛠️ Quick Setup Commands

After getting ad slot IDs from AdSense:

```bash
# Edit App.js to add your slot ID
# Replace: slot="YOUR_AD_SLOT_ID"
# With: slot="1234567890"

# Deploy
# Use Emergent UI: Replace Deployment + Keep Database
```

---

## 📝 Example Implementation

**Homepage with Real Slot ID:**
```jsx
// In App.js
import { DisplayAd } from "@/components/AdUnit";

function Home() {
  return (
    <div>
      {/* Your converter tool */}
      
      {/* Ad placement */}
      <div className="max-w-4xl mx-auto my-12">
        <DisplayAd slot="1234567890" />
      </div>
      
      {/* FAQ section */}
    </div>
  );
}
```

**Blog Post with In-Article Ad:**
```jsx
// In BlogPost.js
import { InArticleAd } from "@/components/AdUnit";

<article>
  <h1>{post.title}</h1>
  
  {/* First section of content */}
  
  {/* Ad after intro */}
  <InArticleAd slot="9876543210" className="my-8" />
  
  {/* Rest of content */}
</article>
```

---

## 🎯 Next Steps

1. **Check AdSense Status** - Is your account approved?
   
2. **If Approved:**
   - Create 2-3 ad units in AdSense
   - Copy slot IDs
   - Update code with real slot IDs
   - Deploy
   - Ads will show within 24 hours

3. **If Not Approved:**
   - Add more content (15-20 blog posts)
   - Improve content quality
   - Ensure site navigation works
   - Apply again in 2-4 weeks

4. **Monitor Performance:**
   - Check AdSense dashboard daily
   - Track which placements perform best
   - Adjust based on data

---

## 📞 Need Help?

**AdSense Support:**
- https://support.google.com/adsense
- Check approval status
- Get slot IDs
- View earnings

**Common Issues:**
- "Ads not showing" - Wait 24 hours after adding units
- "Low revenue" - Need more traffic
- "Account under review" - Wait for approval

---

## ✅ Checklist

Before deploying:
- [ ] AdSense account approved
- [ ] Created ad units in AdSense dashboard
- [ ] Copied ad slot IDs
- [ ] Replaced `YOUR_AD_SLOT_ID` in code
- [ ] Tested locally (placeholders show)
- [ ] Deployed to production
- [ ] Waited 24 hours for ads to appear

**Once ads are showing:**
- [ ] Monitor performance in AdSense
- [ ] Create more content
- [ ] Optimize ad placements
- [ ] Check compliance with AdSense policies

---

**Your site is ready for ads!** Just need AdSense approval and slot IDs. 🎯
