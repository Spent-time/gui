define({

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

    tour: {
        cancel: 'End tour',
        previous: 'Previous',
        next: 'Next',
        end: 'Done',
        step1: {
            title1: 'Welcome',
            title2: 'tour',
            text: 'Hi there!' +
            '<br><br>To ensure a smooth and pleasant start we have put together a tour for you. This will help you get up2speed with things in no time.' +
            '<br><br>You can end the tour at any time. It will only take a few minutes of your time.' +
            '<br><br> We hope you enjoy the tour!',
            cancel: 'I\'m fine, thanks',
            next: 'Sure, show me'
        },
        step2: {
            title1: 'Main',
            title2: 'menu',
            text: 'This here is the main menu. At the moment it is collapsed, a state called "focus mode". You can ' +
            'switch the menu mode by clicking on the Spent time icon at the top of the menu.<br><br>' +
            'The expanded menu is shown next. '
        },
        step3: {
            title1: 'Main',
            title2: 'menu',
            text: 'Now that the menu is expanded you get a more comfortable view of what is available.<br><br>' +
            'You can choose your prefererred menu startup mode in the settings menu.'
        },
        step4: {
            title1: 'Overview',
            title2: 'menu',
            text: 'The overview is like a dashboard or homepage. ' +
            '<br><br>On this overview you will find badges and charts with performance indicators based on your Spent time data.'
        },
        step5: {
            title1: 'Overview',
            title2: 'badges',
            text: 'The badges on the overview will have their color applied based on your treshold settings which can be defined for each badge and period.'
        },
        step6: {
            title1: 'Period',
            title2: 'selection',
            text: 'The period on which the badges report can be easily changed trough the period selection menu.<br><br>' +
            'In the settings menu a default period selection can be set.'
        },
        step7: {
            title1: 'Tracking',
            title2: 'calendar',
            text: ''
        },
        step8: {
            title1: 'Tracker',
            title2: 'items',
            text: ''
        },
        step9: {
            title1: 'Report',
            title2: 'menu',
            text: ''
        },
        step10: {
            title1: 'Search',
            title2: 'menu',
            text: 'You can use the search menu for full-text searches trough your Calendar, Projects and Reports.'
        },
        step11: {
            title1: 'Settings',
            title2: 'menu',
            text: ''
        },
        step12: {
            title1: 'Feedback',
            title2: 'service',
            text: ''
        }
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

    overview: {
        title: 'Overview',
        header: 'Dashboard',
        setting: {},
        button: {
            day: 'Today',
            week: 'This week',
            month: 'This month'
        },
        badge: {
            planned: {
                title: 'Planned',
                detail1: '',
                detail2: 'Tracker items'
            },
            spent: {
                title: 'Spent',
                detail1: '',
                detail2: 'Tracker items'
            },
            payed: {
                title: 'Payed',
                detail1: 'Unbilled',
                detail2: 'Billed'
            }

        }
    },

    search: {
        title: 'Search',
        header: 'Apps',
        settings: {}
    },

    timeTracker: {
        title: 'Time tracker',
        header: 'Apps',
        setting: {
            duration: {
                title: 'Duration',
                dateInterval: {
                    label: 'Default view',
                    day: 'Day',
                    week: 'Week',
                    month: 'Month'
                },
                firstDayOfWeek: {
                    label: 'First day of the week'
                },
                startTimeOfDay: {
                    label: 'Working day start time',
                    mising: 'The working day starting hour is a required field',
                    range: 'The working day starting hour should be between 0 and 23',
                    invalid: 'The working day starting hour should be a number'
                },
                minHours: {
                    label: ''
                },
                maxHours: '',
                minDurationSteps: '',
                minDurationUnit: ''
            },
            grid: {
                title: 'Grid',
                snapSteps: '',
                snapUnit: '',
                showTimeIndicator: {
                    label: 'Show tracking start/stop'
                },
                rowHeaderTimePattern: '',
                columnHeaderDatePattern: ''
            }
        }
    },

    itemTracker: {
        title: 'Item tracker',
        header: 'Apps',
        setting: {}
    },

    reports: {
        title: 'Reports',
        setting: {}
    },

    settings: {
        title: 'Settings',
        setting: {},
        template: {
            header: 'More'
        }
    },

    account: {
        title: 'Account',
        setting: {},
        button: {
            signout: 'Sign out'
        }
    },


    // general buttons
    ok: 'OK',
    cancel: 'Cancel'

});