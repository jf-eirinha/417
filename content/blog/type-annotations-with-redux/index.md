---
title: Typescript and Redux
date: "2020-09-12T21:40:32.169Z"
description: Description of my way to use Typescript with Redux in React
---

When I first started using Typescript one particular area in which I add to spend some time thinking about type annotations was Redux. At the time I looked at two very good resources for this: Redux's official documentation, and [this](https://github.com/piotrwitek/react-redux-typescript-guide) public repo built with various contributions from the React community, containing practical recipes for using Typescript and Redux.

Having read those and after several iterations while adding and changing features, I got to what I currently think of my ideal way to type and organize the different Redux elements.

This guide of course is highly opinionated; I don't think there is such thing as a "canonical" way to do this. This is just a collection of patterns and naming conventions that I feel are easy to work with.

I will go through a basic example that shows a To-Do list (of course!, the "Hello World" of web applications) connected to a Redux store in a React application. All this app does is it fetches a list of todos from a fake API and displays it. The user also has the ability to hide or see the todos. That's it! As I go through the example I will be comparing the annotations to the style of implementation that I most often see being used. The whole code can be accessed in [this](https://codesandbox.io/s/redux-typescript-example-1k4xs) sandbox.

This particular example organizes our store in ducks and sagas files, but that has no connection to what I am trying to illustrate. I won't be explaining the reason for that choice as it is out of this article's scope.

Let's get to it! Starting with what we keep in our store and what actions we want to perform.

## Actions

```javascript
export enum TodosActionTypes {
  FETCH_TODOS_REQUEST = "FETCH_TODOS_REQUEST",
  FETCH_TODOS_SUCCESS = "FETCH_TODOS_SUCCESS",
  FETCH_TODOS_ERROR = "FETCH_TODOS_ERROR",

  TOGGLE_TODOS_VIEW = "TOGGLE_TODOS_VIEW"
}
```

Our first design decision comes here. Most often people will use a string for each action type; enums provide a better way to do it.

  1. You can import all of your action types once and don't need to change imports again when you change the store
  2. It provides you with autocomplete when writing each action type

The value of each constant is the same as its name. Notice that I don't prefix the action type with the domain/feature it belongs to as I find that useless for debugging - the only valid reason I can think of to use it. For action types that belong to an asynchronous request I always suffix their name with `REQUEST`, `SUCCESS`, or `ERROR`, corresponding to each phase of the request's lifecycle.

## Store State

```javascript
const initialState: TodosStore = {
  todos: [],
  requestStatus: {
    fetchTodos: {
      isFetching: false,
      error: ""
    }
  },
  view: true
};
```

The only meaningful note about state is that I choose to include a `requestStatus` property if any asynchronous request is used. In it I include an entry for each request, each being of type:

```javascript
export type RequestStatus = {
  isFetching: boolean;
  error: string;
};
```

This standard organizes the error handling from those requests. I prefer doing most of the error handling (which I don't include in the example) in the saga; this error string property is meant to store messages to be shown in the UI, i.e., messages relevant to the user. Things like redirects, logs, etc. should be done in the saga not at the component level.

## Action Creators

Now, action creators. Action creators help us reuse and organize our code. They're just functions that return an action we can dispatch to the store. For asynchronous requests I create an object with each action creator. This is to clearly communicate the relationship between these three actions:

```javascript
export const fetchTodosActions = {
  request: (payload: FetchTodosPayload) => {
    return {
      type: TodosActionTypes.FETCH_TODOS_REQUEST,
      payload
    } as const;
  },
  success: (response: FetchTodosResponse) => {
    return {
      type: TodosActionTypes.FETCH_TODOS_SUCCESS,
      response
    } as const;
  },
  error: (error: string) => {
    return {
      type: TodosActionTypes.FETCH_TODOS_ERROR,
      error
    } as const;
  }
};
```

I choose to give the `payload` property to every action with a payload (except for errors and responses). This is closer to the [Flux Standard Action](https://github.com/redux-utilities/flux-standard-action) (although I don't fully adhere to it) and makes it easier when adding new actions: you can copy and paste that object and simply replace the types.

For synchronous actions I just type them as such:

```javascript
export const toggleViewAction = () =>
  ({
    type: TodosActionTypes.TOGGLE_TODOS_VIEW
  } as const);
```

Notice the `as const` as well; the const assertion makes the action readonly. (Although... If we wanted to be really strict about immutability we could also use the `Readonly<T>` utility type for the store's state. I choose not to as I feel it makes the code too verbose and obscures the data, so I prefer to communicate through code to future maintainers that you should not mutate state)

## Reducer

The reducer takes our state and returns a new one after executing an action. So that should be reflected in its type annotations: it takes an initial state (`initialState` as seen above), one of the actions we created (`TodosAction`), and returns a new state of type `TodoStore` - the same as `state`. 


```javascript
export default function reducer(
  state = initialState,
  action: TodosAction
): TodosStore {
  switch (action.type) {
    case TodosActionTypes.FETCH_TODOS_REQUEST: {
      return update(state, {
        requestStatus: {
          fetchTodos: {
            isFetching: { $set: true }
          }
        }
      });
    }

    case TodosActionTypes.FETCH_TODOS_SUCCESS: {
      return update(state, {
        todos: { $set: action.response.todos },
        requestStatus: {
          fetchTodos: {
            isFetching: { $set: false }
          }
        }
      });
    }

    case TodosActionTypes.FETCH_TODOS_ERROR: {
      return update(state, {
        requestStatus: {
          fetchTodos: {
            error: { $set: action.error },
            isFetching: { $set: false }
          }
        }
      });
    }

    case TodosActionTypes.TOGGLE_TODOS_VIEW: {
      return update(state, {
        view: { $set: !state.view }
      });
    }

    default:
      return state;
  }
}
```

As you can see I also use an [immutability library](https://github.com/kolodny/immutability-helper); this makes it much easier to deal with the state without mutating it.

The `TodosAction` type is simply an union of all the possible action types. Now, while we could explicitly define each of those actions - as many people do -, that would be redundant, in the sense that we already "know" that type because it is whatever type each of the action creators returns.

So, to be clear, as an example, instead of doing something of this sort:

```javascript
type ActionFoo = {
  type: 'FOO',
  someFooPayload: string
}

type ActionBar = {
  type: 'BAR'
}

type MyAction = ActionFoo | ActionBar
```

(A slightly better version of this would be:)

```javascript
const FOO = 'FOO'
const BAR = 'BAR'

type ActionFoo = {
  type: typeof FOO,
  someFooPayload: string
}

type ActionBar = {
  type: typeof BAR
}

type MyAction = ActionFoo | ActionBar
```

We can use the `ReturnType<T>` utility type to get the same thing.

```javascript
export type MyAction =
  | ReturnType<typeof fooAction>
  | ReturnType<typeof barAction>;
```

For the object containing the action creators for the asynchronous request it's a bit trickier, because the functions are nested inside the object. So with a little hand I created a helper type to get the return type of the functions nested inside the object:

```javascript
type ReturnNestedType<T> = T[keyof T] extends (...args: any) => infer R
  ? R
  : never;
```

So I end up defining the `TodoAction` as:

```javascript
export type TodosAction =
  | ReturnType<typeof toggleViewAction>
  | ReturnNestedType<typeof fetchTodosActions>;
```

## Sagas

Finally, I define each of my sagas using the template below. I define the action argument as the return type of the `request` action creator, make the request, and `put` either a `success` or `error` action.

As recommended in Redux's [documentation](https://redux.js.org/style-guide/style-guide#put-as-much-logic-as-possible-in-reducers), if I need to perform any transformation of the response before changing the store's state I typically do it in the reducer, not in the saga, this also facilitates typing the actions - success actions _always_ take the response type as it comes from the API.

As the reader might expect, instead of the fake API I normally would `call` the real API and `yield` the result. Typescript can't infer that result so I explicitly tell it what the response will be. We should however have in mind that this works as long as we don't "break our promise" to Typescript, i.e., as long as the response is really of that type. If the API returns a response that is not of that type then the compiler can't give you any guarantees. There are [safer and inherently more complex](https://github.com/gcanti/io-ts) ways to this that I am still exploring and won't cover here.

```javascript
export function* fetchTodosSaga(
  action: ReturnType<typeof fetchTodosActions.request>
) {
  try {
    const response: FetchTodosResponse = fakeApi(action.payload.userId);

    yield put(fetchTodosActions.success(response));
  } catch (error) {
    yield put(fetchTodosActions.error(error.message));
  }
}
```

## Component Props

Ok, so we have our store setup and we want to use it, so we connect the component to the store:

```javascript
export const mapStateToProps = ({ todos, view }: TodosStore) => ({
  todos,
  view
});

export const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      fetchTodos: fetchTodosActions.request,
      toggleView: toggleViewAction
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Todos);
```

Let's dissect what we did here: we map the state from the store we want to access, bind the action creators (this just means that the `fetchTodos` is a `dispatch()` of the action creator `fetchTodosActions.request`), and connect them to our component.

To type the component's props we could - again -, explicitly type them; but we don't need that! We know the state type, and we know the action types that we need to dispatch. So our props are: i) the store state we mapped to the component props, ii) the methods to dispatch our actions, and iii) whatever other props the component has; in this case, `title`.

```javascript
type TodosProps = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> & {
    title: string;
  };
```

And that's it. Hope you get something out of this. Don't forget to smash that like button and subscribe!... Oh wait, no, this is not where we say these things.
