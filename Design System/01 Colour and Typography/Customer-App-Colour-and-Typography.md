# GlowTap Customer App — Colour & Typography

Customer App visual foundations · Design reference · 04 November 2026

## Colour tokens

| Token / role | Value | Use | Gradient / placement |
|---|---|---|---|
| Brand Violet | #8B00E8 | Primary buttons, links, active controls | Gradient start, 0% |
| Mid Magenta | #C026D3 | Gradient transition | Gradient midpoint, 48% |
| Brand Pink | #FF03C8 | Accent and emphasis | Gradient end, 100% |
| Ink | #241828 | Main headings and body copy | Solid text |
| Muted | #7A6E78 | Supporting copy and metadata | Solid text |
| Line | #EDE4EC | Input/card borders and separators | Solid border |
| Surface | #FBF7FA | Soft surfaces | Solid fill |
| White | #FFFFFF | Screen and card backgrounds | Solid fill |
| Preview surround | #EFEAF4 | Prototype canvas | Solid fill |

**Primary gradient:** linear-gradient(100deg, #8B00E8 0%, #C026D3 48%, #FF03C8 100%). Use for branded moments and primary emphasis.

## Typography

| Placement / text | Typeface | Size | Weight | Example / colour |
|---|---|---:|---:|---|
| Display | Muli-SemiBold | 32 px | 600 semi-bold | Large figures, ratings, or amounts |
| Hero | Montserrat-Light | 38 px | 300 light | Sign-in headline, e.g. “Book your next” |
| Heading | Muli-SemiBold | 22 px | 600 semi-bold | Page title, e.g. “Welcome back” |
| Title | Muli-Bold | 17 px | 700 bold | Section/card title, e.g. “Popular near you” |
| Body | Muli-Regular | 14 px | 400 regular | Sentences, field text, placeholders |
| Label | Muli-SemiBold | 14 px | 600 semi-bold | Buttons, chips, row labels |
| Caption | Muli-Regular | 12 px | 400 regular | Secondary lines and field labels |
| Link | Muli-Bold | 16 px | 700 bold | Text buttons, e.g. “Book” |
| Badge | Muli-Bold | 10 px | 700 bold | Small marks, ratings, counts |

## Typography token specifications

| Role | Used for | Font file | Size (px) | Line height (px) | Letter spacing |
|---|---|---|---:|---:|---:|
| Display | Large figures, such as a rating or amount | Muli-SemiBold | 32 | 40 | 0.23 |
| Hero | Sign-in headlines, including “Book your next” | Montserrat-Light | 38 | 43 | 0 |
| Heading | Page titles, such as “Welcome back” and a salon name | Muli-SemiBold | 22 | 28 | 0.17 |
| Title | Section and card titles, such as “Popular near you” and the current location | Muli-Bold | 17 | 23 | 0.13 |
| Body | Sentences, field text, and placeholders | Muli-Regular | 14 | 21 | 0.1 |
| Label | Buttons, chips, and row labels | Muli-SemiBold | 14 | 20 | 0.1 |
| Caption | Secondary lines and field labels | Muli-Regular | 12 | 18 | 0.09 |
| Link | Text buttons, such as “Book” | Muli-Bold | 16 | 24 | 0.11 |
| Badge | Small marks, such as a rating or count | Muli-Bold | 10 | 12 | 0.09 |

Font sizes, line heights, and letter-spacing values follow the supplied typography reference image. Confirm the project's font files and letter-spacing unit with design before implementation.

## Placement and content

| Screen area | Placement | Text content | Specification |
|---|---|---|---|
| Safe-area header | Top, below device inset | Screen name, e.g. “Bookings” | Heading: Muli-SemiBold 22/28px; ink |
| Discovery hero | Upper content before search/cards | Hero headline and location prompt | Hero: Montserrat-Light 38/43px; body: Muli-Regular 14/21px |
| Salon/service card | Main scroll area | Name, rating, distance, price | Title 17/23px bold; badge 10/12px; caption 12/18px |
| Form | Content flow, label above field | “Mobile number”, “Email address” | Label 14/20px semi-bold; body 14/21px regular |
| Primary action | Bottom of flow or card | “Continue”, “Book now” | Link/action 16/24px bold; button label 14/20px semi-bold |
| Bottom navigation | Fixed bottom dock | Home, Bookings, Notifications, Profile | Label 14/20px semi-bold; active state highlighted |

## Colour artifacts

<div class="swatches"><span style="background:#8B00E8">Violet<br>#8B00E8</span><span style="background:#C026D3">Magenta<br>#C026D3</span><span style="background:#FF03C8;color:#241828">Pink<br>#FF03C8</span></div>

<div class="gradient">Brand gradient · 100° · Violet 0% → Magenta 48% → Pink 100%</div>

## Source

Typography role and measurement values supplied in the user's attached reference images. The current HTML prototype uses other font families; this table records the requested design reference and should be treated as the target specification.
