import { CSSResult, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

import { IData } from '../models';
import { BaseKeyboardElement } from './base-keyboard-element';

@customElement('remote-keyboard')
export class RemoteKeyboard extends BaseKeyboardElement {
	onClick(e: Event, _longpress: boolean) {
		e.stopImmediatePropagation();
		this.fireHapticEvent('light');
		(
			(e.currentTarget as HTMLInputElement).children[1] as HTMLElement
		).focus();
	}

	onKeyDown(e: KeyboardEvent) {
		e.stopImmediatePropagation();

		const keyToKey: Record<string, string> = {
			Backspace: 'DEL',
			Delete: 'FOWARD_DEL',
			Enter: 'ENTER',
			ArrowLeft: 'DPAD_LEFT',
			ArrowRight: 'DPAD_RIGHT',
		};

		const key = keyToKey[e.key ?? ''];
		if (key) {
			if ((e.currentTarget as HTMLInputElement).value != '') {
				(e.currentTarget as HTMLInputElement).blur();
				(e.currentTarget as HTMLInputElement).value = '';
				(e.currentTarget as HTMLInputElement).focus();
			}

			switch ((this.keyboardMode ?? '').toUpperCase()) {
				case 'KODI':
					break;
				case 'ANDROID TV':
				default:
					this.sendCommand(key);
					break;
			}
		}
	}

	onInput(e: InputEvent) {
		e.stopImmediatePropagation();

		const text = e.data;
		if (text) {
			let data: IData;
			switch ((this.keyboardMode ?? '').toUpperCase()) {
				case 'KODI':
					data = {
						entity_id: this.keyboardId,
						method: 'Input.SendText',
						text: text,
						done: false,
					};
					this.hass.callService('kodi', 'call_method', data);
					break;
				case 'ANDROID TV':
				default:
					data = {
						entity_id: this.keyboardId,
						command: 'input text "' + text + '"',
					};
					this.hass.callService('androidtv', 'adb_command', data);
					break;
			}
		}
	}

	onPaste(e: ClipboardEvent) {
		e.stopImmediatePropagation();
		e.preventDefault();

		const text = e.clipboardData?.getData('Text');
		if (text) {
			let data: IData;
			switch ((this.keyboardMode ?? '').toUpperCase()) {
				case 'KODI':
					data = {
						entity_id: this.keyboardId,
						method: 'Input.SendText',
						text: text,
						done: false,
					};
					this.hass.callService('kodi', 'call_method', data);
					break;
				case 'ANDROID TV':
				default:
					data = {
						entity_id: this.keyboardId,
						command: 'input text "' + text + '"',
					};
					this.hass.callService('androidtv', 'adb_command', data);
					break;
			}
		}

		(e.currentTarget as HTMLInputElement).blur();
		(e.currentTarget as HTMLInputElement).value = '';
		(e.currentTarget as HTMLInputElement).focus();
	}

	onFocus(e: InputEvent) {
		(e.currentTarget as HTMLInputElement).value = '';
		(
			(e.currentTarget as HTMLInputElement).parentElement!
				.children[0] as HTMLElement
		).style.color = 'var(--state-active-color)';
		(e.currentTarget as HTMLInputElement).style.zIndex = '9';
		(e.currentTarget as HTMLInputElement).parentElement!.style.zIndex = '1';
	}

	onFocusOut(e: InputEvent) {
		(e.currentTarget as HTMLInputElement).value = '';
		(
			(e.currentTarget as HTMLInputElement).parentElement!
				.children[0] as HTMLElement
		).style.color = '';
		(e.currentTarget as HTMLInputElement).style.zIndex = '';
		(e.currentTarget as HTMLInputElement).parentElement!.style.zIndex = '';
	}

	render() {
		const inputTemplate = html`
			<input
				spellcheck="false"
				autocorrect="off"
				autocomplete="off"
				autocapitalize="off"
				onchange="this.value=''"
				onkeyup="this.value=''"
				@focus=${this.onFocus}
				@focusout=${this.onFocusOut}
				@input=${this.onInput}
				@paste=${this.onPaste}
				@keydown=${this.onKeyDown}
			></input>
		`;
		return super.render(inputTemplate);
	}

	static get styles(): CSSResult | CSSResult[] {
		return [
			super.styles as CSSResult,
			css`
				input {
					opacity: 0;
					filter: alpha(opacity=0);
					top: 0;
					left: 0;
					position: absolute;
					width: -moz-available;
					width: -webkit-fill-available;
					width: fill-available;
					height: -moz-available;
					height: -webkit-fill-available;
					height: fill-available;
				}
			`,
		];
	}
}
