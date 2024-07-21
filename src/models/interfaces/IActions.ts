export type Action =
	| 'key'
	| 'source'
	| 'repeat'
	| 'call-service'
	| 'navigate'
	| 'url'
	| 'assist'
	| 'more-info'
	| 'fire-dom-event'
	| 'none';

export type ActionType =
	| 'tap_action'
	| 'hold_action'
	| 'double_tap_action'
	| 'multi_tap_action'
	| 'multi_hold_action'
	| 'multi_double_tap_action'
	| 'momentary_start_action'
	| 'momentary_end_action';

export type DirectionAction = 'up' | 'down' | 'left' | 'right';

export interface IData {
	[key: string]: string | string[] | number | number[] | boolean;
}

export interface ITarget {
	entity_id?: string | string[];
	device_id?: string | string[];
	area_id?: string | string[];
	label_id?: string | string[];
}

export interface IConfirmation {
	text?: string;
	exemptions?: [{ user: string }];
}

export interface IBrowserMod {
	service?: string;
	data?: IData;
	target?: ITarget;
}

export interface IAction {
	action: Action;

	key?: string;
	source?: string;

	service?: string;
	data?: IData;
	target?: ITarget;

	navigation_path?: string;
	navigation_replace?: boolean;
	url_path?: string;

	confirmation?: boolean | IConfirmation;

	pipeline_id?: string;
	start_listening?: boolean;

	browser_mod?: IBrowserMod;

	double_tap_window?: number;
	hold_time?: number;
	repeat_delay?: number;
}

export interface IActions
	extends IBasicActions,
		IMomentaryActions,
		IMultiActions {}

export interface IBasicActions {
	tap_action?: IAction;
	double_tap_action?: IAction;
	hold_action?: IAction;
}

export interface IMultiActions {
	multi_tap_action?: IAction;
	multi_double_tap_action?: IAction;
	multi_hold_action?: IAction;
}

export interface IMomentaryActions {
	momentary_start_action?: IAction;
	momentary_end_action?: IAction;
}
