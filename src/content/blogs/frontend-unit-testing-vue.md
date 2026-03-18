---
title: "FE Unit Testing (Vue)"
date: "2025-05-01"
tags: ["knowledge share", "javascript", "testing"]
excerpt: "So, what do we test?"
---

# Testing the FE

- Like the BE there are a couple of types of tests that we can perform
  - Typically, in the BE you would see unit tests and integration tests
  - E2E testing is also another form of testing that is used to test the validity of both the FE and BE of a system
- As most people may have experienced at this point, FE testing is a little different, do we really right unit tests for FE code?
- The Vue docs break tests into three sections
  - Unit tests
  - Component tests
  - E2E tests

## Unit tests

- Test the inputs and outputs of
  - Functions
  - Classes
  - Composables
- Validating small and discrete pieces of code are working as expected
- Focused on logical correctness
- Can mock a lot of application environment
- This code is framework agnostic, it is just javascript/typescript
  - However, Composables are Vue specific and require a little more setup but past that they aren't too different from testing normal functions

## Component tests

- What are components
  - The building blocks of a FE, in our context it is the `.vue` files that we work with - each file is a component
  - Components contain a lot of functionality, the elements, styles, and scripts
  - Components can consume the functions, classes, and composables that we test in unit testing - so component testing is larger than unit testing
- Component tests = Testing components, making sure they
  - Mount
  - Render
  - Can be interacted with
  - Behaves as expected

## End-to-End tests

- Testing the entire system in a live environment (or local environment)

### Other testing in the FE (aside)

- Accessibility Testing
- Snapshot Testing
  - What the component(s) look like when mounted with styles apply, and whether there are differences between different versions of the component(s)

## Unit Tests vs Component Tests

- When we are working on the FE we are mainly working with `.vue` files
- Unit testing is what we do in the BE, so this isn't anything new and we all know how to test functions - same concept, different language
- So, we actually want to learn about Component Testing

# Diving into Component Testing a bit more

- Component testing validates everything about the component
  - Interfaces (props, events, slots)
  - Styles + Classes
  - Hooks
  - etc.
- Consider it a little like Integration testing, we want to test the component as if we were a user of the system, and we want to test how our component integrates with other components
  - Though the level of integration varies depending on how you setup your test: how much mocking do you do?
  - Remember, testing is about validating behaviour, not implementation
- The purpose of a component is to manipulate the DOM, this is the main thing we want to validate (our output)

# Basic test structure

For a component, let's say `Modal.vue`, you will also have a respective test file for that component: `Modal.spec.ts` or `Modal.test.ts` (`[Vue FileName].[spec|test].ts`). `.spec` vs `.test` is semantics which I won't dive into, the main thing you remember is just to align your test files with the codebase's conventions.

Within a test file there are two hooks used to structure the file: `describe` and `test`/`it`. `describe` tells us what component is being tested, or what area/group of behaviour within the component that is being tested. `test`/`it` contains the individual test case that we are validating. `test` and `it` are the same, like `.spec` and `.test` it is mainly a semantic difference and will depend on the codebase - align with the team's convention. These hooks come from the `vitest` library which is our test runner, but they are effectively the standard in FE testing, so you'll see them in other libraries and even with E2E testing.

The structure of the test file may look something like the following:

```typescript
// Imports

// The root "describe" should have the component's name that you are testing
describe("Modal", () => {
    /**
    * An individual test cases, start simple w/o interactions
    *
    * When using `it` instead of `test` the goal is to make the name be read as one thing: "it renders Modal in default state as expected"
    */
    it("renders Modal in default state as expected", () => {
        // Some test implementation
    })

    // You can also group similar test cases together in another describe block
    describe("on confirm", () => {
        it("emits event", () => { ... })

        it("closes modal", () => { ... })
    })

    // etc.
})
```

## Test setup

In our codebase we are using the `vue/test-utils` library, which supports with our interaction with the component, so the syntax discussed here will be in that format.

When creating a new test case there may be a couple of things you need to worry about:

- Mounting the component
- Mocking libraries or API requests
- Other setup/cleanup

## Mounting

Mounting is just a process of rendering the Vue component within a contained test environment. There are two methods of mounting:

- `mount`
  - This is the approach you will see and use the most, it will render everything defined in your components as well as every child component defined within your component too.
- `shallowMount`
  - This method is used when you just want to mount your component, any child component will be stubbed/mocked. This is useful when you want to validate behaviour in a component with a very large number of child elements, such as in `App.vue`. This makes testing easier as you are less concerned about side-effects, but it provides a less accurate representation of your component's behaviour and so it should typically be avoided.

Both methods return a "wrapper" of our vue component with a bunch of useful apis for us to interact with and validate out component. Both approaches also allow you to configure the components environment a little, including providing `props`, `stubs`, `slots`, and a couple of other configurations.

You mount the component via the following:

```typescript
/**
 * Where:
 *   `mount` is imported from the `vue/test-utils` library
 *   `Modal` is our imported `Modal.vue` component
 *   The second parameter in `mount` is all of the configurations for the mount
 *   `wrapper` as the constant name is a common convention, you typically won't use anything else unless you are finding an element that exists in the wrapper
 */
const wrapper = mount(Modal, {
  props: { header: "My modal header" },
  slots: { default: "Modal content" },
})
```

You will want to mount your component within an `it` test case as each test case may require different setup, and you probably don't want your component to exist between test cases. (This will also mean you won't need to `wrapper.unmount()` your component, as the garbage collection will be automatic once your wrapper goes out of scope.) Also, don't be afraid to mode this mount all to a generic function (one that calls `mount` and returns its output) that sits outside all of your tests, there may be some props that exist between test cases that can be simplified.

So your test case may start to look like

```typescript
it("renders Modal in default state as expected", () => {
  const wrapper = mount(Modal, {
    props: { header: "My modal header" },
    slots: { default: "Modal content" },
  })

  // Write assertions, etc.
})
```

## Finding elements

Vue Test Utils provides us with a handful of methods when it comes to selecting elements:

- `.find` and `.findAll`
  - We use these to find a single or all elements matching a [CSS Selector](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_selectors) (i.e., id = `#some-id`, element type = `div`, class = `.heading`, attributes = `[data-testid="modal_header"]`, and so on). This is the same semantics that the `document.querySelector` method uses in the browser.
  - When using `.find`, it is possible that an element isn't found, so if we expect it to exist then we should need to also assert that it exists before we interact with the returned element
  - We typically want to use these methods to find elements that may or may not exist, and assert depending on our expectations - or in the case of `findAll`, find multiple elements with one query
- `.get`
  - We query elements the same way that we do with `.find` and `.findAll`
  - However, if an element does not exist then an error will be thrown, and the test will fail
  - We should use this almost all of the time, unless we just want to assert that specific elements exist in basic test cases, or if we want to assert that elements **don't** exist
- `.findComponent`, `.findAllComponents`, and `.getComponent`
  - Pretty much what is said on the box, does what the previous methods do but instead of passing as CSS Selector string as the query parameter, you provide Vue component
  - This is useful for simple validations, but our end user isn't aware of the components, so it doesn't reflect what the user would directly interact with (i.e., over buttons, inputs, and other html elements) and so we should avoid using this approach

These methods are called from our defined wrapper, i.e., `wrapper.find('[data-testid="modal_header"]')`. Using `.find` and `.get` returns an element wrapper too (assuming `.find` returns a valid element), so you are able to redeclare and use other wrappers like you would with the root wrapper. For example, in your test you may do the following:

```typescript
describe("on confirm", () => {
  it("emits event", () => {
    const wrapper = mount(Modal, {
      props: { header: "My modal header" },
      slots: { default: "Modal content" },
    })

    const confirmButton = wrapper.get(
      'button[data-testid="modal_confirm_button"]',
    )
    expect(confirmButton.text()).toBe("Confirm")

    // Trigger the button, etc.
  })
})
```

For the sake of discussion, if we wanted to use `.find` instead, the test case would look need to look like the following:

```typescript
describe("on confirm", () => {
  it("emits event", () => {
    const wrapper = mount(Modal, {
      props: { header: "My modal header" },
      slots: { default: "Modal content" },
    })

    const confirmButton = wrapper.find(
      'button[data-testid="modal_confirm_button"]',
    )
    // We need to assert `.find` returns a valid element before we can interact with the element
    expect(confirmButton.exists()).toBe(true)
    expect(confirmButton.text()).toBe("Confirm")

    // Trigger the button, etc.
  })
})
```

As such you should typically favour using `.get` to improve predictability and reduce the number of unnecessary lines (unless you explicitly want to validate that an element does or does not exist).

## data-testid

> `data-*` attributes are used to attach information to an element without it affecting how that element funcitons.

I have mentioned `data-testid` a couple of times here, and it is a strongly recommended convention to use this as the element identifier, rather than using ids, classes, or anything else. There are many reasons for this:

- `class`, `id`, and other attributes are very closely tied to the implementation of the element
  - Classes can be used multiple times within the same element making it not specific enough
  - Ids are very specific to the element, and may change as the element's purpose changes
  - Attributes such as these may be dynamically generated or applied, making it less predictable about how to best query for an element
- Because `data-testid` values have no implications on anything other than tests, we can make them verbose which helps with readability of our test cases
- With a UI full of `data-testid` attributes, our ability to create E2E tests is greatly improved as we would have a reference in our UI for almost every meaningful element. These attributes are consistent, predictable, and generally unaffected by non-impactful code changes.

That being said, adding the element type isn't a bad idea if the element type is meaningful, for example if we expect to get a `button` or `input`, if these element types were to change our test would usually break anyway. For layout elements, `div`, `span`, `section`, etc, favour using the `data-testid` as the test shouldn't be concerned semantic structure.

> [Ideally](https://testing-library.com/docs/queries/about#priority) you should be querying elements using their accessible properties, i.e., finding a button based on its role or element type and finding it by the button's name. Or finding an input field by it's `label`. Querying for elements using this approach is **more** favourable than using `data-testid` attributes because we are also validating our accessibility a little. This is what another popular testing library [Vue Testing Library](https://testing-library.com/docs/vue-testing-library/intro/) does, it supports for query elements based on its role as well as other ease of life queries. As vue test utils doesn't support this, our intentions should be to keep our approach to querying aligned across the codebase.

The naming conventions of `data-testid` is very team dependant, component dependant, and judgement dependant. There is no catch all case for how `data-testid` names should be, and where they should be attached to. However, I suggest the below:

#### Adding the component name

> Importance: High

Put the component's name in the data-testid to support with locating, this is useful if your component is ever a child of another component and is valuable when the project is built and served, it greatly supports with E2E testing. In the case of our modal component all of our data-testids should be prefixed with `modal_`.

#### Snake Case

> Importance: Medium

This is a team-based convention, but the suggestion for using snake case is that it can denote hierarchy and the use case of `data-testid` is a little different to class names or ids, which we usually use kebab case with (though this is also team dependant). This suggestion is mainly to support with hierarchy, as you may want to reference layout sections within your data-testid to make it clearer about the position and use case of a selector. For example, within a modal (`data-testid="modal"`) you may have a header section (`data-testid="modal_header"`) containing a close button (`data-testid="modal_header_close_button"`) and a title (`data-testid="modal_heading"`). Our title doesn't need the `header_` prefix as there should only be one heading for a modal (though it can be included for consistency), whereas the close button needs it because there may be a close button in the modal's footer.

#### Dynamic data-testids

> Importance: Low

It is possible and reasonable to make a portion of the `data-testid` value dynamically generated, though you ideally want to adhere to the above conventions too. This suggestion is usually beneficial when you have a lot of very granular and reAusable components (buttons, inputs) which can be hard to find the difference between if they have generic data-testid values. As such you may want to do something like `data-testid="button_${buttonId}"`, or use the label, or use some other data. This is fine, but it hampers the benefit that using `data-testid` provides: predictable identifiers that aren't too closely coupled with the element.

Another way that this approach could be implemented is via passing in a `data-testid` property to the component. For example, if we had a button component, and that button is used by the modal component, then we may want to provide the relevant modal prefix to the child component. Something like:

```html
<CustomButton data-testid="modal_footer_confirm">Confirm</CustomButton>
```

Where the `Button` component then consumes this to generate the following identifier: `data-testid="${dataTestId}_custom_button"`. This approach can be particularly valuable when scaling for E2E testing, it allows for selecting the elements directly i.e., `modal_footer_confirm_custom_button` rather than finding `data-testid="modal_footer"` and then `data-testid="custom_button"`.

### Putting it all together

Based on the above information about how to use `data-testid`, we may end up with a component that looks like the following:

```html
<dialog data-testid="modal">
  <div>
    <div data-testid="modal_header">
      <h2 data-testid="modal_heading">Modal Header</h2>
      <button data-testid="modal_header_close_button">x</button>
    </div>

    <div data-testid="modal_content">
      Some modal content
      <slot />
    </div>

    <div data-testid="modal_footer">
      <button data-testid="modal_footer_confirm_button">Confirm</button>
      <button data-testid="modal_footer_close_button">Close</button>
    </div>
  </div>
</dialog>
```

For simplicity's sake I have not included the dynamic `data-testid` approach.

# So, What do we Test?

When writing tests, we want to validate the behaviour rather than the implementation of our component. Whilst this is can be less obvious than a method which may have a handful of inputs and an output or two, our component still has inputs and outputs that we need to validate.

Inputs may come in the form of:

- User interactions - Clicking, typing, hovering, etc. Just anything the user may do
  - You do this by interacting with `wrapper.trigger()`, where the `.trigger()` method takes a DOM event as its parameter, i.e., `click`, `submit`, `keyup`, etc.
  - `wrapper.setValue()` can is used if you want to set the value of an input field, whether the parameter of `setValue` is the value you want to set on the field. Note that `wrapper` in this case must be an `input` HTML element.
  - A pretty common gotcha I see is that people don't realise that `trigger` and `setValue` are asynchronous functions, so you will need to `await` them before continuing on with the test case.
- Props - Our components parameters and _includes_ slots
- Data sources - API calls, data stores, browser storage

And outputs may come in the form of:

- DOM updates - Observable elements changing (creating, updating, deleting)
- Events - Usually emits, but can be other browser events too
- Side effects - API calls, store updates, browser storage

We do not want to be testing the internal functionality of the component, usually in the form of its methods. Accessing, triggering, and validating methods and values via `wrapper.vm.someMethod` or `wrapper.vm.someRef` is a very big red flag that you are not testing correctly, you are testing the component's implementation. If you _need_ to validate this way, then you should break up the component; create smaller components, move properties and/or functions to separate files, composables, stores, or utility functions. (`wrapper.vm.$nextTick()` is ok though, as we may need to wait for a Vue process to complete before we can interact with or validate the component, though we should ideally use an asynchronous assertion as it makes the test more predictable).

## Validations

There is only one way to validate with Vitest, and that is with the `expect` function which we have seen a bit already. Typically, you will just use `expect` with the validation `.toBe` (which we prefer over `.toEqual` as the validations are a bit looser - `.toEqual` validates that the reference is the same), and `.toContain`. There are of course more many [more validations available](https://vitest.dev/api/expect.html) with Vitest, but you will mainly be using the two aforementioned validations because you mainly just want to assert that something is true or is equal to something else. Such a use case may be:

```typescript
expect(wrapper.get('[data-testid="modal_heading"]').text()).toBe(
  "My Modal Header",
)
```

## Coverage

Don't strive for 100% test coverage, it sounds good on paper, but it really hampers because you get focused on implementation details rather than the behaviour of the component. Just because some test coverage is missing also doesn't mean that the code needs to be tested, it may be the case that the code shouldn't need to be tested at all because it is obvious and simple.

# Do's and Don't in testing

## Accessing elements

- How to access elements?
  - Why use `data-testid` over other things (ids, classes, etc)?

## Validating the component's functionality

- Don't test the component's private methods
  - I.e., `wrapper.vm.[...]`

# Things I didn't have time to Document and Discuss

- TDD with component testing
- Arrange, Act, Assert in component testing
- Parameterised tests
- More in-depth look into coverage
- An actual style guide
- How to best mock/spy?
  - And what the difference is between the two!
- How do/should we validate the application of styles?
  - You can't really validate styles, because they aren't completely supported (or supported at all) by the DOM libraries used in testing (libraries that are used to mount the components)
  - Validate classes
  - If you did want to validate that styles are correct you would need to use Snapshot testing or E2E testing
- pinia
- directives vs stubs vs mocks vs spy
- If statements in tests

# Bibliography

- [Testing](https://vuejs.org/guide/scaling-up/testing)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [Testing Library](https://testing-library.com/docs/queries/about#priority)
- [Common Mistakes with React Testing Library](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Psychological effects of coding style](https://www.devever.net/~hl/codingstylepsych)
