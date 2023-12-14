# Android TV Remote Card

[![GitHub Release][releases-shield]][releases]
[![License][license-shield]](LICENSE.md)
[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg?style=for-the-badge)](https://github.com/custom-components/hacs)
![Project Maintenance][maintenance-shield]
[![GitHub Activity][last-commit-shield]][commits]
[![Community Forum][forum-shield]][forum]

[![Github][github]][github]

[![My Home Assistant](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?repository=android-tv-card&owner=Nerwyn&category=Plugin)

📦 This repo is a fork of [tv-card](https://github.com/usernein/tv-card), which is a fork of another [tv-card](https://github.com/marrobHD/tv-card) merged with two other projects, and includes the same features and improvements usernein made, like:

- Touchpad for navigation
- Slider for volume
- Haptic feedback
- Customizable layout
- Everything optional

Along with a many other changes and improvements:

**Ported to TypeScript**

- Refactored to use proper types (no anys!) and separated large objects like the default keys and sources into their own files.
- Proper use of packages such as `lit-element` and `custom-card-helpers`.
- Separates out buttons, touchpad, and slider into separate lit elements for better stability and maintainability.
- Provides a clean base on which to add future features.

**Redesigned for the [Android TV Remote integration](https://www.home-assistant.io/integrations/androidtv_remote/) (but can be used for anything)**

- Uses `remote.send_command` to send commands to an Android TV for all default keys and sources using Android TV Remote entity ID `remote_id`.
- Navigation speed increased to be closer to (but not as crazy fast) as the Google TV remote.
- Hold press/touch/swipe actions only repeat for directional and volume keys, and perform a long press for anything else.

**Fully customizable touchpad**

- Touchpad actions are now remappable by creating custom keys for `up`, `down`, `left`, `right`, and `center`.
- Alter touchpad CSS using `touchpad_style`.
- Touchpad style now follows theme.
- Touchpad haptics can now be toggled.

**Tap, double tap, and hold tap actions support for buttons and touchpad**

- All buttons and the touchpad `center` command support tap, double tap, and long tap custom actions.
  - Using the [Home Assistant actions](https://www.home-assistant.io/dashboards/actions/) syntax.
- Supports the actions `call-service`, `navigate`, `url`, and `none` along with card specific actions `key` and `source`.
- Hold actions cannot be remapped for `up`, `down`, `left`, `right`, `volume_up`, `volume_down`, and `delete` as they repeat while held.

**Better row handling and columns**

- Rows exist in a `rows` array with no limit on the number of rows you can add.
- Sliders and touchpads can now be placed in rows alongside other buttons.
  - For special volume and navigation features use `vol_buttons`, `slider`, `dpad`, and `touchpad` as button names within a row.
- Empty buttons are no longer clickable.
- Create columns by creating an array within a row array (see examples). Create an array within that array to create another row. Experiment with nesting rows and columns to make weird remote layouts.

**Better button icon handling**

- Many more default keys and sources with SVG icons for sources with no material design icon present in Home Assistant's default material design icon list.
  - _Not all default keys and sources are working or tested at this time, please let me know if you find the correct source/activity names for the ones that are incorrect._
  - _Also let me know if you find a key or source that is not listed here and you want to add to the default lists!_
- Custom actions that replace default ones will now inherit the default icons and tap actions if no new ones are given.
- Alter CSS of all buttons using `button_style`.
- Alter CSS of an individual button by including a `style` object in a custom action.
- Button haptics can now be toggled.

**Fully native slider**

- Slider has been replaced with a native solution rather than an embedding an external card.
  - Greatly improves the stability of the slider as it now renders consistently with the rest of the card.
- Slider is now animated like Home Assistant tile and Mushroom sliders.
- Slider purpose can be changed by creating a custom action for `slider`.
- Alter CSS of slider using `slider_style`.
- Change slider range using `slider_range`.
  - Defaults to [0,1] but can be changed for media players that use different volume ranges.
- Slider style now follows theme.

**Keyboard support**

- Send text to text input fields on your Android TV using `androidtv.adb_command` by setting the media player entity ID created by the [Android Debug Bridge integration](https://www.home-assistant.io/integrations/androidtv/) to `keyboard_id`.
- Includes three different methods:
  - **Seamless text entry** - Create and press the button `keyboard` to pull up the on screen keyboard (on mobile, otherwise use your physical keyboard) and send keystrokes seamlessly to your Android TV.
    - Also works with backspace, delete, enter, and left and right keys.
  - **Bulk text entry** - Create and press the button `textbox` to pull up a browser prompt in which you can type in text to send to your Android TV all at once.
    - Highly recommended that you also create buttons for `delete` and `enter` so you can remove and send your input text.
  - **Google Assistant search** - Create and press the button `search` to pull up a browser prompt in which you can type in text to send to your Android TV to process as a Google Assistant search.
    - Works well if you are experiencing [this issue](https://github.com/home-assistant/core/issues/94063).
- Can also be used for Kodi (see below)

**Template support**

- Supports Home Assistant jinja2 style templating using nunjucks.
- Uses the same syntax as normal Home Assistant templating with a subset of functions.

Many thanks to the original authors. Getting this to work with Android TV was straightforward and all of the frontend heavy lifting they did has provided an excellent base on which to build my personal ultimate Android TV remote.

# Demo

```yaml
type: custom:android-tv-card
remote_id: remote.google_chromecast
slider_id: media_player.google_chromecast
keyboard_id: media_player.google_chromecast_adb
title: Example
rows:
  - - back
    - power
    - home
  - - keyboard
    - search
    - slider
  - - - netflix
      - null
      - youtube
      - null
      - spotify
    - touchpad
  - - previous
    - play_pause
    - next
```

<img src="assets/screenshot.png" alt="ex" width="300"/>

# Installation

## Step 1

This project is now available on [HACS](https://hacs.xyz/)! Search for it under frontend repositories.

## Step 2

When in edit mode on a lovelace view, click add card and search for Android TV Card. Create a remote config like the below examples.

```yaml
type: custom:android-tv-card
remote_id: remote.google_chromecast
slider_id: media_player.google_chromecast
rows:
  - - power
    - channel_up
    - info
    - channel_down
  - - netflix
    - youtube
    - spotify
  - - slider
  - - touchpad
  - - back
    - home
    - tv
  - - rewind
    - play_pause
    - fast_forward
```

# Options

## Basic

| Name  | Type   | Description                          |
| ----- | ------ | ------------------------------------ |
| type  | string | Must be `custom:android-tv-card`     |
| title | string | Title to display in the card header. |

All fields are technically optional except for `type`, but the card will not function unless you customize it using the above options.
Using only these options you will get an empty card (or almost empty, if you set a title).

## Buttons

| Name                   | Type     | Description                                                                                                                                                                                                                              |
| ---------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| rows                   | string[] | Defines the buttons used in the card. Each row within rows defines a row of buttons (or slider and touchpad). Sub-arrays within these rows will display as columns, and sub-arrays within those will alternate between rows and columns. |
| remote_id              | string   | The `remote` entity id to control, required for default commands.                                                                                                                                                                        |
| enable_button_feedback | boolean  | Enable vibration feedback on the buttons, defaults to `true`.                                                                                                                                                                            |
| button_style           | object   | CSS style to apply to all buttons.                                                                                                                                                                                                       |

In order to include the buttons, you need to specify in the config the rows you want and which buttons you want in it.
You do it by declaring the rows as arrays and its buttons as values.
See [this file](https://github.com/Nerwyn/android-tv-card/blob/main/src/models/defaultKeys.ts) for a list of default keys, and [this file](https://github.com/Nerwyn/android-tv-card/blob/main/src/models/defaultSources.ts) for a list of default sources.

```yaml
rows:
  - - power
  - - rewind
    - play_pause
    - fast_forward
```

There is no hard limit to the number of rows, columns, or buttons you can add.

### Button Style

You can declare a global button style using the `button_style` option, like so.

```yaml
button_style:
  '--size': 32px
  color: var(--secondary-text-color)
```

#### Example options:

| Name             | Description                                                                                                                         |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| --size           | Sets the width and height of the button icon and all of it's sub elements.                                                          |
| color            | Color of the button.                                                                                                                |
| background-image | Image to set the button to. Use with `background-size: contain`, `background-repeat: no-repeat`, and `background-position: center`. |

### Special Elements

This card also supports the following special button shortcuts and elements which can be added to any row or column. `slider` and `touchpad` will be further explained below.

| Name                                                        | Type     | Description                                                                                                                     |
| ----------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------- |
| vol_buttons, volume_buttons                                 | buttons  | Shorthand to generate a set of volume down, volume mute, and volume up buttons in a row or column.                              |
| dpad, d_pad, direction_pad, nav_buttons, navigation_buttons | buttons  | Shorthand to generate a set of up, down, left, right, and center buttons arranged in a d-pad across three rows within a column. |
| slider, volume_slider                                       | slider   | A slider that controls the entity defined by `slider_id`.                                                                       |
| touchpad, nav_touchpad, navigation_touchpad                 | touchpad | A touchpad that functions the same as navigation buttons but uses swipe actions instead.                                        |

## Custom Actions

| Name           | Type   | Description                                                                                                                                                                                                                                                                           |
| -------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| custom_actions | object | Custom actions for the remote control. Each item is an object that can optionally have an `icon` (will use original key icon if overwriting an existing one and icon is not provided) and at least one of the following properties: `tap_action`, `hold_action`, `double_tap_action`. |

If you want to add custom buttons to the remote control (or if you want to reconfigure the existing buttons or touchpad actions), you can do it by adding an object to the `custom_actions` object. Each object should contain one or more of either `tap_action`, `hold_action`, and or `double_tap_action`.

| Name              | Type              | Description                                                                                                                                                                                     |
| ----------------- | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| icon              | string            | Name of an icon to use. If overriding a default action uses the default icon if not defined                                                                                                     |
| confirmation      | boolean or object | Whether to display a browser confirmation popup or not before executing an action. See [here](https://www.home-assistant.io/dashboards/actions/#options-for-confirmation) for more information. |
| tap_action        | object            | Action to perform on single tap.                                                                                                                                                                |
| hold_action       | object            | Action to perform when held. **_Only works on mobile._**                                                                                                                                        |
| double_tap_action | object            | Action to perform when double tapped. Adding this introduces a 200ms delay to single tap actions. **_Does not work on iOS._**                                                                   |

The following default keys cannot have hold actions added to them, as they repeat when held:

- up
- down
- left
- right
- volume_up
- volume_down
- delete

```yaml
custom_actions:
  input_tv:
    icon: mdi:television-classic
    tap_action:
      action: key
      key: tv
  browser:
    icon: mdi:web
    tap_action:
      action: source
      source: browser
  toggle_light:
    icon: mdi:lightbulb
    tap_action:
      action: call-service
      service: light.toggle
      target:
        entity_id: light.bedroom
    hold_action:

  to_hass_home:
    icon: mdi:view-dashboard
    tap_action:
      action: navigate
      navigation_path: /lovelace/0
    double_tap_action:
      action: navigate
      navigation_path: /lovelace/1
    hold_action:
      action: navigate
      navigation_path: /lovelace/2
```

Then you can easily use these buttons in your card:

```yaml
rows:
  - - browser
    - power
    - input_tv
  - - rewind
    - play_pause
    - fast_forward
    - toggle_light
```

<img src="assets/custom_keys.png" alt="guide" width="300"/>

With custom actions you can override existing buttons for changing its icon or even its functionality. Here I do both:

```yaml
custom_actions:
  power:
    icon: mdi:power-cycle
    tap_action:
      action: call-service
      service: media_player.toggle
      target:
        entity_id: media_player.tv
```

### Action Types

Actions follow the [Home Assistant actions](https://www.home-assistant.io/dashboards/actions/) syntax. It supports a subset of Home Assistant actions along with `key` and `source`, which are shorthands for remote service calls.

| Action       | Description                                                              |
| ------------ | ------------------------------------------------------------------------ |
| key          | Send a key to send to the TV via the service call `remote.send_command`. |
| source       | Switch to a source via the service call `remote.turn_on`.                |
| call-service | Call any Home Assistant service.                                         |
| navigate     | Navigate to another Home Assistant page.                                 |
| url          | Navigate to an external URL.                                             |
| none         | Explicilty set a command to do nothing.                                  |

Each action has a set of possible options associated with them. If `action` is not provided the card will guess which type of action it is by the options used.

#### key

| Name | Description                                                                                                                                                                                                   |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| key  | Android TV key. While most Android TV remote keys are already defined as default keys, you can find a list of supported commands [here](https://www.home-assistant.io/integrations/androidtv_remote/#remote). |

```yaml
custom_actions:
  menu:
    icon: mdi:menu
    tap_action:
      action: key
      key: MENU
    hold_action:
      action: key
      key: HOME
```

By default, hold actions on keys adds `hold_secs: 0.5` to the data sent with the `remote.send_command` service call. Creating a `hold_action` on a key action overwrites this.

#### source

| Name   | Description                                                                                                                                                       |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| source | Android TV app. See [here](https://community.home-assistant.io/t/android-tv-remote-app-links-deep-linking-guide/567921) for a guide on Android TV app deep links. |

```yaml
custom_actions:
  netflix:
    icon: mdi:netflix
    tap_action:
      action: source
      source: netflix://
```

#### call-service

| Name    | Description                                                                                                                                                      |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| service | The service to call. Use the format `domain.service`, e.g. `"light.turn_on"`.                                                                                    |
| data    | Additional data to pass to the service call. See the Home Assistant documentation or go to Developer Tools > Services to see available options for each service. |
| target  | The entity IDs, device IDs, or area IDs to call the service on.                                                                                                  |

`data` and `target` get internally merged into one object since `hass.callService` only has a single data field. You can safely put all information into one object with any of these names. This was done so that you can easily design service calls using Home Assistant's service developer tool and copy the YAML to custom button configurations in this card.

```yaml
custom_actions:
  toggle_light:
    icon: mdi:lightbulb
    tap_action:
      action: call-service
      service: light.toggle
      target:
        entity_id: light.theater
    double_tap_action:
      action: call-service
      service: light.turn_on
      target:
        entity_id: light.theater
      data:
        brightness_pct: 10
    hold_action:
      action: call-service
      service: light.turn_off
      target:
        entity_id: light.theater
```

#### navigate

| Name               | Description                                                          |
| ------------------ | -------------------------------------------------------------------- |
| navigation_path    | Home Assistant page to navigate to.                                  |
| navigation_replace | Whether to replace the current page in the history with the new URL. |

```yaml
custom_actions:
  to_hass_home:
    icon: mdi:view-dashboard
    tap_action:
      action: navigate
      navigation_path: /lovelace/0
    double_tap_action:
      action: navigate
      navigation_path: /lovelace/1
    hold_action:
      action: navigate
      navigation_path: /lovelace/2
```

#### url

| Name     | Description                      |
| -------- | -------------------------------- |
| url_path | External website to navigate to. |

```yaml
custom_actions:
  google:
    icon: mdi:google
    tap_action:
      action: url
      url_path: https://www.google.com
```

### Custom Button Style

You can define an icon and CSS style for each button.

| Option | Description                                                                                                                                                |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| icon   | The icon to show in the button. Can be a Home Assistant built in mdi icon, an icon defined by another custom integration, or a custom icon as shown below. |
| style  | CSS style to apply to this specific button. Is applied on top of `button_style`.                                                                           |

If an icon is not provided for a custom key or source that overwrites a predefined key or source, the original icon will be used instead.

### Custom Icons

| Name         | Type   | Description                                                   |
| ------------ | ------ | ------------------------------------------------------------- |
| custom_icons | object | Custom icons for the remote control. Defined using svg paths. |

You can customize any icon with a custom svg path using the `custom_icons` option.

Usage:

```yaml
custom_icons:
  <button>: <svg_path>
```

Example:

```yaml
custom_icons:
  hbo: >-
    M7.042 16.896H4.414v-3.754H2.708v3.754H.01L0
    7.22h2.708v3.6h1.706v-3.6h2.628zm12.043.046C21.795 16.94 24 14.689 24
    11.978a4.89 4.89 0 0 0-4.915-4.92c-2.707-.002-4.09 1.991-4.432
    2.795.003-1.207-1.187-2.632-2.58-2.634H7.59v9.674l4.181.001c1.686 0
    2.886-1.46 2.888-2.713.385.788 1.72 2.762 4.427 2.76zm-7.665-3.936c.387 0
    .692.382.692.817 0 .435-.305.817-.692.817h-1.33v-1.634zm.005-3.633c.387 0
    .692.382.692.817 0 .436-.305.818-.692.818h-1.33V9.373zm1.77
    2.607c.305-.039.813-.387.992-.61-.063.276-.068 1.074.006
    1.35-.204-.314-.688-.701-.998-.74zm3.43 0a2.462 2.462 0 1 1 4.924 0 2.462
    2.462 0 0 1-4.925 0zm2.462 1.936a1.936 1.936 0 1 0 0-3.872 1.936 1.936 0 0 0
    0 3.872Z
```

You can also paste the entire SVG path onto one line.

The svg path was copied from [SimpleIcon](https://simpleicons.org/?q=hbo). Although you can use [this integration](https://github.com/vigonotion/hass-simpleicons) for using icons from SimpleIcons (there's also one for [fontawesome](https://github.com/thomasloven/hass-fontawesome)).

I highly recommend using a service like [iLoveIMG Resize SVG](https://www.iloveimg.com/resize-image/resize-svg) to resize any icons you find to 24x24 pixels so that they render correctly, and [this SVG path editor](https://yqnn.github.io/svg-path-editor/) to modify the icons to properly fit within the 24x24 pixel window.

Having defined the custom icon, you can use it on any custom button:

```yaml
custom_actions:
  max:
    icon: hbo
    tap_action:
      source: hbomax://deeplink
```

## Slider

| Name                   | Type             | Description                                                                 |
| ---------------------- | ---------------- | --------------------------------------------------------------------------- |
| slider_id              | string           | The entity id to use for the optional slider.                               |
| slider_attribute       | string           | An attribute (or state) for the slider to track, defaults to `volume_level` |
| enable_slider_feedback | boolean          | Enable vibration feedback on the slider, defaults to `true`.                |
| slider_range           | [number, number] | The range of the slider, defaults to [0,1].                                 |
| slider_style           | object           | CSS style to apply to the slider.                                           |

By default the slider calls the `media_player.volume_set` service, with `entity_id` set to `slider_id` and `volume_level` set to the slider value.

You can change this by creating a custom action for `slider`. Set the value which you wish to set using the slider to `VALUE`.

```yaml
custom_actions:
  slider:
    tap_action:
      service: light.turn_on
      data:
        entity_id: light.sunroom_ceiling
        brightness: VALUE
slider_range:
  - 0
  - 255
```

You can change the attribute that the slider tracks by setting `slider_attribute` to either `state` or an entity specific attribute.

```yaml
slider_attribute: brightness
```

While most Home Assistant media player's use a volume range of [0,1], you can changes this as needed by setting `slider_range`.

```yaml
slider_range:
  - 0
  - 0.6
```

### Slider Style

Similary to `button_style`, `slider_style` can be used to change the CSS of the slider.

| Name                | Description                                                               |
| ------------------- | ------------------------------------------------------------------------- |
| --color             | Color of the slider thumb / percentage on.                                |
| --background        | Slider background color.                                                  |
| height              | Slider thumb / percentage on height.                                      |
| --background-height | Slider background height. Maximum is contrained by the foreground height. |
| --border-radius     | Border radius of the entire slider.                                       |

## Touchpad

| Name                     | Type    | Description                                                    |
| ------------------------ | ------- | -------------------------------------------------------------- |
| touchpad_style           | object  | CSS style to appy to the touchpad.                             |
| enable_touchpad_feedback | boolean | Enable vibration feedback on the touchpad, defaults to `true`. |

### Touchpad Style

| Name             | Description                                                                                                                               |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| height           | Height of the touchpad, including units. Defaults to 250px.                                                                               |
| background       | Color of the touchpad. Follows theme by default.                                                                                          |
| background-image | Image to overlay on the touchpad. Use with `background-size: contain`, `background-repeat: no-repeat`, and `background-position: center`. |
| opacity          | Opacity of the touchpad.                                                                                                                  |

### Custom Touchpad Commands

The touchpad can be customized using `custom_actions` so that it can be used with other devices. The touchpad acts as a `center` button but also supports touch swipes to send the keys `up`, `down`, `left`, and `right`. You can remap touchpad commands by creating custom actions for these actions. This includes remapping the `center` key hold and double tap actions.

Like buttons, double tap actions introduces a 200ms delay to single taps, and the hold action default adds `hold_secs: 0.5` to the service call data. Double tap and hold actions cannot be added to touchpad directional swipes, just the `center` action.

```yaml
custom_actions:
  up:
    tap_action:
      service: kodi.call_method
      target:
        entity_id: media_player.kodi
      data:
        method: Input.Up
  down:
    tap_action:
      service: kodi.call_method
      target:
        entity_id: media_player.kodi
      data:
        method: Input.Down
  left:
    tap_action:
      service: kodi.call_method
      target:
        entity_id: media_player.kodi
      data:
        method: Input.Left
  right:
    tap_action:
      service: kodi.call_method
      target:
        entity_id: media_player.kodi
      data:
        method: Input.Right
  center:
    tap_action:
      service: kodi.call_method
      target:
        entity_id: media_player.kodi
      data:
        method: Input.Select
    double_tap_action:
      service: kodi.call_method
      target:
        entity_id: media_player.kodi
      data:
        method: Input.Back
    hold_action:
      service: kodi.call_method
      target:
        entity_id: media_player.kodi
      data:
        method: Input.ContextMenu
```

## Keyboard

| Name          | Type   | Description                                                                                                                                                                                                                                        |
| ------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| keyboard_id   | string | The `media_player` entity id to use to send keyboard events. Requires the [Android Debug Bridge integration](https://www.home-assistant.io/integrations/androidtv/) for Android TV, and other media platform integration for other supported ones. |
| keyboard_mode | string | The media platform type for sending keyboard commands. Defaults to `ANDROID TV`. The only other currently supported method is `KODI`.                                                                                                              |

You can use the [Android Debug Bridge integration](https://www.home-assistant.io/integrations/androidtv/) with this card to send text to your Android TV (by default, see below for alternate media platforms). This card includes three different methods for sending text to Android TV.

### Methods

To use the keyboard, create one of three buttons based on the keyboard method you want to use.

#### Seamless Text Entry

Send text to Android TV in seamlessly by creating a button named `keyboard`. Clicking on it will activate several listeners which will send any text you type to the Android TV, along with backspace, delete, enter, left, and right commands (note that the latter two may not behave as expected depending on where the cursor is on the Android TV). You can also paste by holding clicking `CTRL + V` while the keyboard is active or holding down and selecting paste on the keyboard button itself. You may experience some delay as keys are being sent to Android TV as they are being sent one at a time by ADB. Tip: Put the keyboard button at the top of your card so that your screen does not shift to keep it in focus when the on screen keyboard opens.

```yaml
type: custom:android-tv-card
remote_id: remote.google_chromecast
keyboard_id: media_player.google_chromecast_adb
rows:
  - - back
    - home
    - play_pause
  - - keyboard
    - search
  - - touchpad
```

<img src="assets/live_keyboard.png" alt="keyboard example" width="300"/>

#### Bulk Text Entry

Send text to Android TV in bulk by creating a button named `textbox`. Clicking on it will create a text prompt in which you can enter the text which you wish to send. It is highly recommended that you also create keys for `delete` and `enter` so you can easily delete the text you send and quickly search using it.

```yaml
type: custom:android-tv-card
remote_id: remote.google_chromecast
keyboard_id: media_player.google_chromecast_adb
rows:
  - - back
    - home
    - play_pause
  - - vol_buttons
  - - touchpad
  - - delete
    - textbox
    - enter
```

<img src="assets/bulk_keyboard.png" alt="keyboard example" width="300"/>

#### Google Assistant Search

Send text to Android TV to be processed as a Google Assistant global search by creating a button named `search`. Clicking on it will create a text prompt in which you can enter text you wish to search for using Google Assistant on Android TV. This method cannot be used to enter text into text fields on Android TV, but does work if you are experiencing [this issue](https://github.com/home-assistant/core/issues/94063) which prevents the on screen keyboard from appearing, and therefore search from being triggered.

### Alternate Media Platform Support

You can also use the keyboard to send text on the following alternate platforms by setting `keyboard_id` to the entity ID of the platform and `keyboard_mode` to one of the following:

| Media Platform | Info                                                                                                                                                                                                                  |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ANDROID TV`   | Default, not required if using Android TV                                                                                                                                                                             |
| `KODI`         | Does not support backspace, delete, enter, left, and right but these can be used with the on screen keyboard. Seamless mode does not work as the Kodi `Input.SendText` method clears the textbox before sending text. |

More may be added as requested if there is a way to do so through their Home Assistant (or possibly community made) integrations.

## Templating

All fields support nunjucks templating. Nunjucks is a templating engine for JavaScript, which is heavily based on the jinja2 templating engine which Home Assistant uses. While the syntax of nunjucks and jinja2 is almost identical, you may find the [nunjucks documentation](https://mozilla.github.io/nunjucks/templating.html) useful. Please see the [ha-nunjucks](https://github.com/Nerwyn/ha-nunjucks) repository for a list of available functions. If you want additional functions to be added, please make a feature request on that repository, not this one.

## Examples and Alternate Media Platforms

### Example 1

Playing with order, moving and repeating buttons:

```yaml
type: custom:android-tv-card
remote_id: remote.google_chromecast
slider_id: media_player.google_chromecast
title: Example 1
rows:
  - - power
  - - back
    - home
    - tv
    - netflix
  - - youtube
    - spotify
    - netflix
  - - touchpad
  - - slider
  - - channel_up
    - channel_down
    - info
  - - rewind
    - play
    - spotify
    - pause
    - fast_forward
```

Result:

<img src="assets/disorder.png" alt="disorder example" width="300"/>

### Example 2

Buttons, buttons everywhere!

```yaml
type: custom:android-tv-card
remote_id: remote.google_chromecast
slider_id: media_player.google_chromecast
title: Example 2
rows:
  - - power
    - channel_up
    - info
    - channel_down
  - - netflix
    - youtube
    - spotify
  - - vol_buttons
  - - dpad
  - - back
    - home
    - tv
  - - rewind
    - play
    - pause
    - fast_forward
```

Result:

<img src="assets/buttons_everywhere.png" alt="buttons example" width="300"/>

### Example 3

Using less

```yaml
type: custom:android-tv-card
remote_id: remote.google_chromecast
slider_id: media_player.google_chromecast
title: Example 3
rows:
  - - power
    - netflix
    - youtube
    - spotify
  - - slider
  - - touchpad
  - - back
    - home
```

Result:

<img src="assets/using_less.png" alt="less example" width="300"/>

### Example 4

In any row, if you add an empty or `null` item, there will be an empty button sized space:

```yaml
type: custom:android-tv-card
rows:
  - - back
    - home
    - tv
  - - rewind
    - null
    - null
    - fast_forward
```

<img src="assets/empty_buttons.png" alt="empty buttons example" width="300"/>

### Example 5

A tablet UI using columns

```yaml
type: custom:android-tv-card
remote_id: remote.google_chromecast
rows:
  - - - - back
        - null
        - home
        - null
        - menu
      - - volume_down
        - null
        - volume_mute
        - null
        - volume_up
      - - rewind
        - null
        - play_pause
        - null
        - fast_forward
      - - netflix
        - disney
        - hulu
        - max
        - primevideo
      - - plex
        - vudu
        - youtube
        - spotify
    - - - keyboard
        - search
      - - touchpad
touchpad_style:
  height: 300px
```

Result:

<img src="assets/tablet.png" alt="tablet example" width="800"/>

### Example 6

Apple TV

```yaml
type: custom:android-tv-card
remote_id: remote.appletv
rows:
  - - play
    - pause
    - menu
  - - netflix
    - primevideo
  - - touchpad
touchpad_style:
  height: 200px
  background-image: url("https://upload.wikimedia.org/wikipedia/commons/a/ab/Apple-logo.png")
  background-size: contain
  background-repeat: no-repeat
  background-position: center
  opacity: 1.0
custom_actions:
  up:
    tap_action:
      action: key
      key: up
  down:
    icon: mdi:chevron-downtap_action:
      action: key
      key: down
  left:
    tap_action:
      action: key
      key: up
  right:
    tap_action:
      action: key
      key: right
  center:
    tap_action:
      action: key
      key: select
    double_tap_action:
      action: key
      key: menu
  play:
    tap_action:
      action: key
      key: play
  pause:
    tap_action:
      action: key
      key: pause
  menu:
    icon: mdi:apple
    tap_action:
      action: key
      key: menu
  primevideo:
    tap_action:
      action: call-service
      service: media_player.select_source
      data:
        source: Prime Video
      target:
        entity_id: media_player.appletv
  netflix:
    tap_action:
      action: call-service
      service: media_player.select_source
      data:
        source: Netflix
      target:
        entity_id: media_player.appletv
```

Result:

<img src="assets/appletv.png" alt="apple tv example" width="400"/>

### Example 7

Kodi with keyboard and touchpad. Use the [Kodi JSON-RPC API](https://kodi.wiki/view/JSON-RPC_API/v13) to add more buttons like below.

```yaml
type: custom:android-tv-card
keyboard_id: media_player.kodi
keyboard_mode: KODI
rows:
  - - back
    - home
    - menu
  - - info
    - play_pause
  - - - vol_buttons
    - touchpad
    - - textbox
      - null
      - search
touchpad_style:
  height: 200px
  background-image: url("https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Kodi-logo-Thumbnail-light-transparent.png/600px-Kodi-logo-Thumbnail-light-transparent.png?20141126003611")
  background-size: contain
  background-repeat: no-repeat
  background-position: center
  opacity: 1.0;
custom_actions:
  up:
    tap_action:
      action: call-service
      service: kodi.call_method
      target:
        entity_id: media_player.kodi
      data:
        method: Input.Up
  down:
    tap_action:
      action: call-service
      service: kodi.call_method
      target:
        entity_id: media_player.kodi
      data:
        method: Input.Down
  left:
    tap_action:
      action: call-service
      service: kodi.call_method
      target:
        entity_id: media_player.kodi
      data:
        method: Input.Left
  right:
    tap_action:
      action: call-service
      service: kodi.call_method
      target:
        entity_id: media_player.kodi
      data:
        method: Input.Right
  center:
    tap_action:
      action: call-service
      service: kodi.call_method
      target:
        entity_id: media_player.kodi
      data:
        method: Input.Select
    double_tap_action:
      action: call-service
      service: kodi.call_method
      target:
        entity_id: media_player.kodi
      data:
        method: Input.Back
    hold_action:
      action: call-service
      service: kodi.call_method
      target:
        entity_id: media_player.kodi
      data:
        method: Input.ContextMenu
  back:
    tap_action:
      action: call-service
      service: kodi.call_method
      target:
        entity_id: media_player.kodi
      data:
        method: Input.Back
  search:
    icon: mdi:kodi
    tap_action:
      action: key
      key: SEARCH
    style:
      color: rgb(9, 179, 232)
      '--size': 64px
  volume_mute:
    tap_action:
      action: call-service
      service: kodi.call_method
      target:
        entity_id: media_player.kodi
      data:
        method: Application.SetMute
        mute: toggle
  volume_up:
    tap_action:
      action: call-service
      service: kodi.call_method
      target:
        entity_id: media_player.kodi
      data:
        method: Application.SetVolume
        volume: increment
  volume_down:
    tap_action:
      action: call-service
      service: kodi.call_method
      target:
        entity_id: media_player.kodi
      data:
        method: Application.SetVolume
        volume: decrement
  menu:
    tap_action:
      action: call-service
      service: kodi.call_method
      target:
        entity_id: media_player.kodi
      data:
        method: Input.ContextMenu
  home:
    tap_action:
      action: call-service
      service: kodi.call_method
      target:
        entity_id: media_player.kodi
      data:
        method: Input.Home
  info:
    tap_action:
      action: call-service
      service: kodi.call_method
      target:
        entity_id: media_player.kodi
      data:
        method: Input.Info
  play_pause:
    tap_action:
      action: call-service
      service: kodi.call_method
      target:
        entity_id: media_player.kodi
      data:
        method: Player.PlayPause
        playerid: 1
```

Result:

<img src="assets/kodi.png" alt="kodi example" width="400"/>

### Example 8

Sony Bravia KD.xx TV

```yaml
type: custom:android-tv-card
remote_id: remote.sony_kd_75xf8596
rows:
  - - touchpad
custom_actions:
  up:
    tap_action:
      action: key
      key: Up
  down:
    tap_action:
      action: key
      key: Down
  left:
    tap_action:
      action: key
      key: Left
  right:
    tap_action:
      action: key
      key: Right
  center:
    tap_action:
      action: key
      key: DpadCenter
    double_tap_action:
      action: key
      key: Back
```

### Example 9

Marantz Receiver

```yaml
type: custom:android-tv-card
entity_id: media_player.marantz_sr7013
rows:
  - - touchpad
touchpad_style:
  height: 200px
custom_actions:
  down:
    tap_action:
      action: call-service
      service: denonavr.get_command
      target:
        entity_id: media_player.marantz_sr7013
      data:
        command: /goform/formiPhoneAppDirect.xml?MNCDN
  up:
    tap_action:
      action: call-service
      service: denonavr.get_command
      target:
        entity_id: media_player.marantz_sr7013
      data:
        command: /goform/formiPhoneAppDirect.xml?MNCUP
  left:
    tap_action:
      action: call-service
      service: denonavr.get_command
      target:
        entity_id: media_player.marantz_sr7013
      data:
        command: /goform/formiPhoneAppDirect.xml?MNCLT
  right:
    tap_action:
      action: call-service
      service: denonavr.get_command
      target:
        entity_id: media_player.marantz_sr7013
      data:
        command: /goform/formiPhoneAppDirect.xml?MNCRT
  center:
    tap_action:
      action: call-service
      service: denonavr.get_command
      target:
        entity_id: media_player.marantz_sr7013
      data:
        command: /goform/formiPhoneAppDirect.xml?MNENT
    double_tap_action:
      action: call-service
      service: denonavr.get_command
      target:
        entity_id: media_player.marantz_sr7013
      data:
        command: /goform/formiPhoneAppDirect.xml?MNRTN
```

### Example 10

Even more disorder with columns and special elements in the same row as buttons, and stylized everything.

```yaml
type: custom:android-tv-card
remote_id: remote.google_chromecast
slider_id: media_player.google_chromecast
rows:
  - - - home
      - menu
      - back
      - keyboard
    - - netflix
      - hulu
      - disney
      - max
      - primevideo
    - touchpad
  - - slider
    - search
custom_actions:
  netflix:
    tap_action:
      action: source
      source: 'netflix://'
      style:
        color: rgb(229, 9, 20)
  hulu:
    tap_action:
      action: source
      source: 'hulu://'
      style:
        color: rgb(28, 231, 131)
  disney:
    tap_action:
      action: source
      source: 'https://www.disneyplus.com'
      style:
        color: rgb(17, 60, 207)
  max:
    tap_action:
      action: source
      source: 'https://play.max.com'
      style:
        color: rgb(0, 35, 246)
  primevideo:
    tap_action:
      action: source
      source: 'https://app.primevideo.com'
      style:
        color: rgb(0, 165, 222)
slider_range:
  - 0
  - 0.6
touchpad_style:
  background: >-
    linear-gradient(217deg, rgba(255,0,0,.8), rgba(255,0,0,0) 70.71%),
    linear-gradient(127deg, rgba(0,255,0,.8), rgba(0,255,0,0) 70.71%),
    linear-gradient(336deg, rgba(0,0,255,.8), rgba(0,0,255,0) 70.71%)
slider_style:
  '--border-radius': 4px
  height: 24px
  '--background-height': 12px
  '--color': darkred
  '--background': red
```

Result:

<img src="assets/more_disorder.png" alt="more disorder example" width="500"/>

### Example 11

A simple gamepad

```yaml
type: custom:android-tv-card
remote_id: remote.google_chromecast
rows:
  - - dpad
    - - - x
      - - 'y'
        - null
        - a
      - - b
custom_keys:
  a:
    tap_action:
      action: key
      key: a
      style:
        '--size': 48px
        padding: 0
        color: '#C1121C'
  b:
    tap_action:
      action: key
      key: b
      style:
        '--size': 48px
        padding: 0
        color: '#F7BA0B'
  x:
    tap_action:
      action: key
      key: x
      style:
        '--size': 48px
        padding: 0
        color: '#00387b'
  'y':
    tap_action:
      action: key
      key: 'y'
      style:
        '--size': 48px
        padding: 0
        color: '#007243'
button_style:
  '--size': 24px
  background: rgb(27,27,27)
  padding: 8px
  border-radius: 24px
```

Result:

<img src="assets/gamepad.png" alt="gamepad example" width="500"/>

[last-commit-shield]: https://img.shields.io/github/last-commit/Nerwyn/android-tv-card?style=for-the-badge
[commits]: https://github.com/Nerwyn/android-tv-card/commits/main
[forum-shield]: https://img.shields.io/badge/community-forum-brightgreen.svg?style=for-the-badge
[forum]: https://community.home-assistant.io/t/android-tv-card-a-tv-card-fork-for-android-tv/585089
[license-shield]: https://img.shields.io/github/license/Nerwyn/android-tv-card.svg?style=for-the-badge
[maintenance-shield]: https://img.shields.io/badge/maintainer-Nerwyn-blue.svg?style=for-the-badge
[releases-shield]: https://img.shields.io/github/release/Nerwyn/android-tv-card.svg?style=for-the-badge
[releases]: https://github.com/nerwyn/android-tv-card/releases
[github]: https://img.shields.io/github/followers/Nerwyn.svg?style=social
