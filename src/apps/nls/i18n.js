define({
    root: {

        message: {
            confirmed: 'You account is confirmed and activated. Go ahead, sign in!',
            confirmError: 'Ooops! Something went wrong with your confirmation. Please send an email to <a href="mailto:support@spent-time.com">support@spent-time.com</a> to resolve this issue.',
            tokenExpired: 'Your confirmation token has expired <br> (+1 day). Please sign up again'
        },

        // login dialog
        login: {
            username: 'Username',
            password: 'Password'
        },

        menu: {
            dashboards: 'Dashboards',
            apps: 'Apps',
            more: 'More'
        },

        feedback: {
            draw: 'Draw on screen to indicate an issue or illustrate your feedback',
            comment: 'Provide us with your feedback, comments, ideas or other general remarks concerning Spent time'
        },

        general: {
            title: 'General',
            setting: {
                appearance: {
                    title: 'Appearance',
                    theme: {
                        label: 'Theme',
                        dark: 'Dark',
                        light: 'Light'
                    },
                    menu: {
                        label: 'Intial menu state',
                        collapsed: 'Collapsed',
                        expanded: 'Expanded'
                    }
                },
                locale: {
                    title: 'Localization',
                    language: {
                        label: 'Language',
                        browser: 'Use browser setting (Default)',
                        en: 'English',
                        de: 'Deutsch',
                        es: 'Español',
                        fr: 'Français',
                        it: 'Italiano',
                        ja: '日本語',
                        nl: 'Nederlands',
                        pt: 'Português',
                        ru: 'Pусский',
                        zh: '中文'
                    }
                }
            }
        },

        timeTracker: {
            pointer: {
                ok: 'OK, Got it!',
                1: {
                    title: 'Add events',
                    text: 'If you want to add an event just double click anywhere in the grid'
                },
                2: {
                    title: 'Change view',
                    text: 'With the navigation buttons you can change the view period'
                },
                3: {
                    title: 'Track time',
                    text: 'Use the start/stop button to keep track of time'
                }
            },
            title: 'Time',
            header: 'Apps',
            setting: {
                duration: {
                    title: 'Duration',
                    firstDayOfWeek: {
                        label: 'First day of the week',
                        tooltip: 'The day the (work) week starts',
                        browser: 'Use browser setting (Default)',
                        sunday: 'Sunday',
                        monday: 'Monday'
                    },
                    startTimeOfDay: {
                        label: 'Working day start time',
                        hours: {
                            tooltip: 'The time of your working day start (hours)'
                        },
                        minutes: {
                            tooltip: 'The time of your working day start (minutes)'
                        },
                        mising: 'The working day starting hour is a required field',
                        range: 'The working day starting hour should be between 0 and 23',
                        invalid: 'The working day starting hour should be a number'
                    },
                    minHours: {
                        label: 'Visible early',
                        tooltip: 'The earliest hour visible in the time tracker'
                    },
                    maxHours: {
                        label: 'Visible late',
                        tooltip: 'The latest hour visible in the time tracker'
                    },
                    minDuration: {
                        label: 'Minimum time slot',
                        tooltip: 'Minimum duration of an item in the time tracker'
                    },
                    minDurationUnit: {
                        label: '',
                        tooltip: 'Minimum duration unit of an item in the time tracker',
                        minute: 'Minute(s)',
                        hour: 'Hour(s)',
                        day: 'Day(s)'
                    },
                    minDurationSteps: {
                        label: 'Minimum duration addition',
                        tooltip: 'Minimum amount of time added to an item in the time tracker when updating'
                    },
                    minDurationStepsUnit: {
                        label: '',
                        tooltip: 'Minimum time unit added to an item in the time tracker when updating',
                        minute: 'Minute(s)',
                        hour: 'Hour(s)',
                        day: 'Day(s)'
                    }
                },
                grid: {
                    title: 'Grid',
                    dateInterval: {
                        label: 'Default view',
                        tooltip: 'The time tracker view shown when opening the application',
                        day: 'Day',
                        week: 'Week',
                        month: 'Month'
                    },
                    snapSteps: {
                        label: 'Snap duration',
                        tooltip: 'The duration unit which to snap to when manually moving or resizing an event in the time tracker'
                    },
                    snapUnit: {
                        minute: 'Minute(s)',
                        hour: 'Hour(s)',
                        day: 'Day(s)'
                    },
                    showTimeIndicator: {
                        label: 'Show tracking start/stop',
                        tooltip: 'Show or hide the start/stop button and time indicator line in the time tracker'
                    },
                    timeIndicatorRefreshInterval: {
                        label: 'Refresh interval',
                        tooltip: 'The refresh period used to refresh the time tracker and save progress',
                        F1: 'Every minute',
                        F5: 'Every 5 minutes',
                        F15: 'Every 15 minutes',
                        F30: 'Every half hour',
                        F60: 'Once an hour'
                    },
                    rowHeaderTimePattern: {
                        label: 'Time Format',
                        tooltip: 'The time format (hours) shown in the time tracker',
                        browser: 'Use browser setting (Default)',
                        hh: 'H\'h\'',
                        hhmm: 'H\'h\'mm',
                        hmma: 'h:mma'
                    },
                    columnHeaderDatePattern: {
                        label: 'Date Format',
                        tooltip: 'The date format (days) shown in the time tracker',
                        browser: 'Use browser setting (Default)',
                        F1: 'EEE, MMM dd',
                        F2: 'MMM dd',
                        F3: 'MM dd yyyy'
                    }
                }
            }
        },

        itemTracker: {
            title: 'Items',
            header: 'Apps',
            trackers: {
                welcome: 'If you have a request for a tracker you would like to see added you can send an email to ' +
                '<a href="mailto:support@spent-time.com">support@spent-time.com</a> or use the in-app feedback to send a message.',
                available: 'Trackers Available',
                coming: 'Future Trackers'
            },
            unableToDelete: 'Unable to delete',
            itemInUse: 'The item you are trying to delete is in use in the Time tracker on ${d1}. <br>First make sure the item is not in use in the Time tracker and then try again.',
            selectMissing: 'Select an item from the tracker to pair with the event',
            details: {
                description: 'Description',
                tags: 'Tags'
            },
            tags: {
                string: 'String',
                number: 'Number',
                boolean: 'Boolean'
            },
            setting: {}
        },

        reports: {
            title: 'Reports',
            header: 'Apps',
            grid: {
                title: 'Data',
                loading: 'Loading results...',
                noData: 'No results found',
                labels: {
                    date: 'Date',
                    week: 'Week',
                    month: 'Month',
                    days: 'Days',
                    hours: 'Hours',
                    minutes: 'Minutes',
                    duration: 'Duration',
                    label: 'Item'
                }
            },
            output: {
                title: 'Output'
            },
            setting: {}
        },

        settings: {
            header: 'More',
            title: 'Settings',
            setting: {}
        },

        account: {
            header: 'Apps',
            title: 'Account',
            setting: {
                general: {
                    user: 'User',
                    title: 'General',
                    id: 'Id',
                    email: 'Email address',
                    subscription: 'Subscription',
                    active: 'Active',
                    provider: 'Authentication Provider',
                    signout: ''
                },
                data: {
                    title: 'Data'
                }
            },
            button: {
                signout: 'Sign out'
            }
        },

        // general buttons
        ok: 'OK',
        cancel: 'Cancel'
    }
    //'de': true,
    //'es': true,
    //'fr': true,
    //'it': true,
    //'ja': true,
    //'nl': true,
    //'pt': true,
    //'ru': true,
    //'zh': true
});
