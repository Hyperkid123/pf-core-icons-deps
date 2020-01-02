# Set up

1. clone
2. run yarn in root
3. in packages/library run `yarn build`
4. in packages/consumer run `yarn analyze`

If you want to run it in browser run `yarn dev` in packages/consumer. If you want to create production build run `yarn build` in packages/consumer.

# Results

Browser will open two windows with webpack build result. 1st is for server part of application. 2nd is for client side.

Server part is OK. Uses only imported components.

Client side is not OK. If we used the babel transform import to use only components from `dist/js` it will include all ESM react-icons in the build.
You can check it out by going to be 2nd build window, open the left menu, click on the `Show content of concatenated modules (inaccurate)` and then you will see that react-icons is importing icons from esm even when you use the transform plugin to include only icons from dist/js.

![Screenshot from 2019-12-18 11-26-05](https://user-images.githubusercontent.com/22619452/71078263-4cbe5680-2189-11ea-935c-b27ea0ae615f.png)

The only icon used is comming from the Modal close button. No Icon is directly used or imported in the `library` part of this example.

Expected result would be the same as in server part of build.

## What is the difference in final build size?
Using correct imports:

```bash
Compiled successfully.

Automatically optimizing pages  

Page                    Size
┌ ○ /                   100 kB
└   /_app               1.11 kB
+ shared by all         71.8 kB
  ├ chunks/commons.js   65.7 kB
  ├ runtime/main.js     5.26 kB
  └ runtime/webpack.js  812 B

```

With the ESM bug
```
Compiled successfully.

Automatically optimizing pages  

Page                    Size
┌ ○ /                   513 kB
└   /_app               1.11 kB
+ shared by all         71.8 kB
  ├ chunks/commons.js   65.7 kB
  ├ runtime/main.js     5.26 kB
  └ runtime/webpack.js  812 B
```


# How to possibly fix this

- 1st option
  - apply same transformation in react-core and mark react-icons as external dependency.
 - 2nd option
   - use direct paths to icons in react-core eg import SuperIcon from '@patternfly/react-icons/dist/{esm|js}/icons/SuperIcon'
