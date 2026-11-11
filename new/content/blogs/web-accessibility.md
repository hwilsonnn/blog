---
title: "Web Accessibility"
gif: "breakdance.gif"
date: "2025-01-21"
tags: ["knowledge share", "javascript"]
excerpt: "What is web accessiblity and how do we build accessibility into what we do"
---

## Intro to accessibility

- Empty colourblind test
  - Can anyone tell me what this says?

  - No -> Now imagine that this was a website element that contained some important information, you wouldn't even know it was there.

- Web Accessibility is all about lowering the barrier of entry for everyone to be able to perceive, understand, navigate, interact, and contribute to the Web.

- Web Accessibility standards are mainly driven by the World Wide Web Consortium (W3C).
  - This is the organization that develops standards and guidelines for the web, in areas such as:
    - Accessibility

    - Internationalisation

    - Privacy

    - Security

- You will also see Accessibility referenced as A11y - this is called a numerical contraction numeronym btw

### Who are we trying to support

- People with disabilities is typically the main driver for Web Accessibility, disabilities such as: auditory, cognitive, neurological, physical, speech, visual.

- But we also need to consider non-disability-based causes that may hinder access to the web, such as:
  - People using devices other than computers: phones, TVs, smart watches, fridges

  - Temporarily disabled people: broken body parts, temporary blindness

  - Environmental limitations: too sunny, too loud

  - People with slow internet or old hardware

- The United Nations's (UN) Convention on the Rights of Persons with Disabilities (CRPD) also defines access to information and communication technologies (i.e., the Web) a human right, so you don't want to be tried for denying human rights...

## The standards

### How are standards defined?

- The W3C's Web Accessibility Initiative (WAI) creates everything that you would need to know about Web Accessibility
  - Tech specifications

  - Guidelines

  - Techniques

  - Etc

- From all of this content that WAI creates, Web Content Accessibility Guideline (WCAG) standards are created
  - These WCAG standards can be accredited with ISO (International Organization for Standardization) standards

### WCAG Standards

- There are a couple of versions of the WCAG standards, the ones you'll usually see are versions 2.0, 2.1, and the latest version 2.2 which was published in late 2023.
  - First version of WCAG 2.0 was published in 2008

- WCAG 2.2 is the recommended standard and one that we should look to follow.
  - However in order to adhere to the standards of 2.2, we first must adhere to 2.0 and 2.1

- These standards are broken up into a couple of sections
  - Perceivable - Presentable information and components that users can see

  - Operable - How users interact with components and navigate the site

  - Understandable - That the content on the page makes sense and that it works as expected

  - Robust - The site functions on a broad range of devices and user agents

  - Conformance - What is necessary to conform to certain level of the guidelines

#### Conformance metrics

- Each criterion in the standard guide has a conformance metric applied to it

- The conformance levels are
  - A minimal conformance
    - For example, use of alternative text for non-text content

  - AA Mid level
    - For example, input error suggestion, or consistent navigation, or keyboard navigation

  - AAA everything
    - Focus appearance constraints (contrast, visibility). Mainly just clarity of content

- Sites typically only strive for AA conformance, as it can be pretty difficult to achieve AAA conformance.

## How do we build accessibility into what we do

- I see a couple of things that we need to consider accessibility for in what we do:
  - Component accessibility
    - Styles
      - colours - try and ensure there is enough colour contrast

      - font stuff - line height, paragraph spacing, letter spacing, and word spacing should be proportional to the font size

      - sizes - interactive components should be at least 44px by 44px

      - focus states - how to make the focus contrast high enough regardless of the element background

    - Roles

    - ARIA attributes

    - Examples: buttons, inputs, accordions, text blocks, etc

  - Page Structure
    - Layout
      - Page structure makes sense

      - Heading ordering are consistent

    - Navigation
      - Whether you can navigate with a keyboard

      - Navigating between pages is easy in general

  - Performance
    - Is our page performant?

    - What is necessary in order to interact with our page?

    - How to we minimise client-side compute? How do we use the ensure that we only load what we need in order to get the site to function.

    - A lot of these questions can help with SSR, code splitting, preload strategies, lazy loading, etc.

- Accessibility is pretty much in everything that we do, add it to your developer mindset similar to how security and performance should be at the forefront of your mind as you develop.

## How we test + validate it

- [Vue Testing Library](https://testing-library.com/docs/dom-testing-library/api-accessibility/)
  - Build accessibility into unit tests by getting elements via accessibility-based attributes (roles)

  - Also has functions to validate for element accessibility

- [Storybooks](https://storybook.js.org/docs/writing-tests/accessibility-testing)
  - A tool to build a visual representation of an implemented component library, addons to test component accessibility

- [Playwright](https://playwright.dev/docs/accessibility-testing)
  - Scan page for accessibility violations

- [Deque's 'Axe' offering](https://www.deque.com/axe/)
  - DevTools - automated testing, linting, pipeline integrations

  - Auditor - manual auditing

  - Monitor - reports based on webpage scanning

- [Lighthouse](https://developer.chrome.com/docs/lighthouse/accessibility/scoring)
  - Baked into chrome devtools

  - Scans page and gives you a score based on specific accessibility checks

- [Audits](https://www.accessibility.org.au/services/auditing/)
  - Probably the most thorough way to validate how accessible a system is can be through an audit (similar to a pen testing audit).

  - The Centre for Accessibility Australia offer a couple of auditing offers to see the level of accessibility a system is at against the WCAG standards (<https://www.accessibility.org.au/services/auditing/>).

  - Manual testing is the best approach, because people would be able to deduce intentions, so if something isn't implemented then it is called out (rather than automated testing not knowing intentions if something is implemented way off)

## How I personally go about trying to include accessibility

- If I am building a component
  - I go to [W3C WAI ARIA APG Patterns](https://www.w3.org/WAI/ARIA/apg/patterns/) to see W3C's recommendation in building common components

  - Google the component I am building + ' accessibility' and take a look at results for guidelines of that component

  - Take a look at the mdn doc to see if there is anything

- Generally, if you want to build something, then it's likely it has been done before and that there are some Accessibility guidelines to help with what you want to do.
  - For example, the [Material Design](https://m3.material.io/) docs.

- You can also ask the designers about accessibility too if you are unsure.

## Recommendations

- Don't add attributes to element you 'think' will improve accessibility, you have to **know**
  - Incorrectly applied or redundant accessibility attributes can actually be more misleading and confusing

  - For example, don't mis-use ARIA (Accessible Rich Internet Applications) tags
    - ARIA controls the rending of non-visual experiences, primarily used for screen readers.

    - Incorrect ARIA = misrepresented visual experience

    - Just don't misuse accessibility tags

  - A role is a promise, if you add the role tag to something like `role="button"` on a `div`, then that element better work completely like a button; keyboard navigation and all
    - Assigning a `role` is a red herring imo, if you wanted the component to work a certain way then you should use the correct element type.

- Don't override browser defaults unless you are aware of what you need to support, and that you will support it. Try and understand what the browsers responsibility is and what responsibility is, for example scrollbars.

### Common suggestions

- Perceivable
  - Text alternatives for non-text content

  - Captions and other alternatives for multimedia

  - Content can be presented in different ways (default visual format, enlarged visual format, audio format, different colour combinations, etc.)

  - Content is easier to see and hear

- Operable
  - Functionality is available from a keyboard

  - Users have enough time to read and use the content

  - Content does not cause seizures and physical reactions

  - Users can easily navigate, find content, and determine where they are

  - Users can use different input modalities beyond keyboard

- Understandable
  - Text is readable and understandable

  - Content appears and operates in predictable ways

  - Users are helped to avoid and correct mistakes

- Robust
  - Content is compatible with current and future user tools

## Glossary

- A11y - Accessibility

- W3C - World Wide Web Consortium

- UN - United Nations

- CRPD - Contention on the Rights of Persons with Disabilities

- WAI - Web Accessibility Initiative

- WCAG - Web Content Accessibility Guidelines

- ISO - International Organization for Standardization

- APG - Authoring Practices Guide

- ARIA - Accessible Rich Internet Applications

- SSR - Server-Side Rendering

## Bibliography

- [Introduction to Web Accessibility](https://www.w3.org/WAI/fundamentals/accessibility-intro/)

- [Standards Guidelines](https://www.w3.org/WAI/standards-guidelines/)

- [WCAG 2.2](https://www.w3.org/TR/WCAG22)

- [Australian Policy](https://www.accessibility.org.au/policy/australian-policy/)

- [APG Read Me](https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/)

- [Don't use custom CSS scrollbars](https://ericwbailey.website/published/dont-use-custom-css-scrollbars/)

- [A guide to designing accessible, WCAG-conformant focus indicators](https://www.sarasoueidan.com/blog/focus-indicators/)

- [Accessibility Principles](https://www.w3.org/WAI/fundamentals/accessibility-principles/)

- [WAI-ARIA basics](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Accessibility/WAI-ARIA_basics)
