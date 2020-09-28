---
title: A React Custom Hook for Forms
date: "2020-09-19T21:40:32.169Z"
description: Creating a customizable form hook in React
---

Forms are one of the most usual components of modern web applications. There's a lot of shared functionality between each form implementation so it's useful to have a common approach to creating them. Many people share snippets of code they had written before, others like to use one of the many form libraries out there. I tried the latter option and quickly found out that none provided exactly the behavior I wanted. [Formik](https://formik.org/) and [React Hook Form](https://react-hook-form.com/) - the two packages I tried out, are both great solutions but I felt that I preferred something a little more customizable, plus I have a natural aversion to using third-party packages for things I think I can implement myself.

I thought I could make a simple React hook with an API alike to the ones used by those libraries which would give me everything I wanted, and so I went on that quest. I have worked with this hook several times and I find it incredibly useful, but despite the apparent simplicity of forms it seems that there's always a new edge case I hadn't cover, so I still consider it a work in progress. In fact this last versions contains a few valuable improvements suggested by a colleague of mine, so thank you Nuno for the input!

## The API

Before getting into the how it works let's get straight to how you use it. If you want to checkout the whole code, I created a [sandbox](https://codesandbox.io/s/tender-hertz-hezdc) with a basic example of using the hook.

```javascript
const { formState, handleChange, handleFocus } = useForm({
  name: "",
  email: ""
});
```

This creates a form with fields `name` and `email`, and initializes their values as empty strings. The `formState` variable is an object which keeps track of the state's form. `handleChange` and `handleFocus` are functions to hook the form into our inputs. So you would use these methods in an input like so:

```html
<input name="email" onChange={handleChange} onFocus={handleFocus} />
```

The fundamental idea behind the hook is being able to completely customize the form behavior by accessing the form's state. For example if you want an error message of a certain field to appear after another particular field was touched you can access the `touched` and `errors` object. If you want to enable a "Save" button only after the user changed a form value, you can access the `isDirty` value, etc. So all of these behaviors are easy to implement by mixing and matching the properties of the state.

```javascript
const [formState, setFormState] = React.useState<FormState<FormValues>>({
  values: defaultValues,
  errors: {} as Record<FieldName<FormValues>, boolean>,
  errorMsgs: byErrorMsg(rules),
  focused: createStateObject(defaultValues, false),
  touched: createStateObject(defaultValues, false),
  dirty: createStateObject(defaultValues, false),
  isValid: false,
  isDirty: false,
  isTouched: false
});
```

## Common Patterns

In addition to `formState`, `handleChange`, and `handleFocus`, the hook exports two more methods: `resetForm` and `setValue`.

```javascript
const { formState, handleChange, handleFocus, resetForm, setValue } = useForm({
  name: "",
  email: ""
});
```

The latter is a handy way to manually set the value of a field. This can be useful when we need to use some logic outside the form to change its values.

```javascript
if (somethingElseHappens) setValue('email', 'email@mail.com');
```

`resetForm` on the other hand is used when the value of our form is being updated after a certain action. This becomes clear with an example:

You're implementing a profile page. The user has the ability to change information about himself. In that profile page there's a "Save" button but it should only be enabled when the information is different than what's saved in your database, i.e. the user changed something. After the user hits "Save" and the information is updated in the database you want the "Save" button to be disabled again and the form state updated. So imagine that your component is getting fed a "profile" prop with the profile information. When that changes (after a successful update of the database) we want to reset our form state with the new values. So for that we call `resetForm` - which is kept in a component `ref` - on an effect that has `profile` as a dependency. This resets the values of the form and its state and `isDirty` would be `false` again.

```javascript
const resetFormRef = React.useRef(resetForm)

React.useEffect(() => {
  resetFormRef.current(profile)
}, [profile])
```

## Field Validation Rules

If we need to perform some type of field validation, which is usually the case, we can pass a second argument to the hook containing the rules to each field - expressed by an array of functions that each take a field value and return a boolean -, and an error message.

```javascript
const { formState, handleChange, handleFocus } = useForm({
  name: "",
  email: ""
}, {
  email: {
    rules: [isValidEmail],
    message: 'Please provide a valid e-mail'
  },
});
```

## How it works

I drawn inspiration from [React Hook Form](https://react-hook-form.com/) to build the hook but unlike that library I do not use uncontrolled inputs. So the algorithm is actually really straightforward:

- **Initialize State:** We start by initializing the form state with the provided default values. At this moment we also check for errors.
- **State Changes:** The form is updated every time a form field is focused or changed. When this happens the code uses the change and the previous state to compute the new state, namely: what are the new values, what fields have errors, what fields are "dirty", what field is focused, and what fields have been touched. From this it derives if the form is valid (`isValid`), has been touched (`isTouched`), or dirty (`isDirty`).

And that's it. If you want need a tiny hook with a powerful set of functionalities consider using this one and if you have any suggestions or corrections to make please feel free to contact me on GitHub, they are very much appreciated.
