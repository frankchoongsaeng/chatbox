import { useState, useRef, useEffect, useCallback } from 'react'
import { Picker } from 'emoji-mart'
import 'emoji-mart/css/emoji-mart.css'
import css from 'styles/chat.module.css'

function MessageBox({
    onSend,
    onTypingActivityChanged,
    usersTyping = [],
    usersOnline = 0,
}) {
    const [message, setMessage] = useActiveState('', onTypingActivityChanged)
    const [showEmojis, setShowEmojis] = useState(false)
    const messageBoxRef = useRef()

    const sendMessage = () => {
        if (message.trim() === '') return
        onSend(message)
        setMessage('')
    }

    const handleOnTextInputChange = eventObject => {
        const currentValue = eventObject.target.value
        setMessage(currentValue)
    }

    const checkKeys = e => {
        // make sure the emoji

        if (message.trim() === '') return
        if (e.key === 'Enter') {
            sendMessage()
        }
    }

    const addEmoji = emoji =>
        setMessage(message => `${message} ${emoji.native}`)

    return (
        <>
            <span className={css.is_typing_wrapper}>
                {'> '}
                {usersTyping.length > 0
                    ? createTypingMessage(usersTyping)
                    : `${usersOnline} online`}
            </span>

            <div className={css.chat_message_area}>
                {showEmojis && (
                    <div className={`${css.picker_drawer}`}>
                        <Picker
                            set="apple"
                            title=""
                            emoji=""
                            onSelect={addEmoji}
                            showPreview={false}
                            style={{ width: '100%' }}
                        />
                    </div>
                )}
                <button
                    onClick={() => setShowEmojis(canShow => !canShow)}
                    className={css.picker}
                >
                    😃
                </button>
                <input
                    className={css.message_box}
                    type="text"
                    value={message}
                    onChange={handleOnTextInputChange}
                    onKeyUp={checkKeys}
                    placeholder="Start typing your message..."
                    autoFocus
                    ref={messageBoxRef}
                />
                <button className={css.send_button} onClick={sendMessage}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                    </svg>
                </button>
            </div>
        </>
    )
}

/**
 * A function that observes a state and calls a provided function
 * after a certain period if the state keeps changing within that period.
 * Returns a `state` and a `setState`
 * @param {any} initialValue state
 * @param {function} cb callback handler to pass the current activity when the activity changes.
 */
function useActiveState(initialValue, cb = undefined) {
    const isInitialLoadRef = useRef(true)
    const [state, setState] = useState(initialValue)
    const timeOfLastestActivityRef = useRef(Date.now())
    const [isActive, setIsActive] = useState(false)
    const observeActivityTimeoutIdRef = useRef(null)
    const waitForIdleTimeoutRef = useRef(null)

    const waitForIdle = useCallback(() => {
        // reset the timeout if an activity occurred within the last 1 sec
        if (waitForIdleTimeoutRef.current)
            clearTimeout(waitForIdleTimeoutRef.current)
        const maximumAllowedInactivityPeriod = 1000 // 1 second

        // it's in an idle state if no activity
        // has occurred for the last 3 seconds
        waitForIdleTimeoutRef.current = setTimeout(() => {
            setIsActive(false)
            waitForIdleTimeoutRef.current = null
        }, maximumAllowedInactivityPeriod)
    }, [])

    /**
     * change active state to true after 1 second
     * if the last activity time is less than 1 second
     * and the isActive is false
     */
    const waitForConstantActivity = useCallback(() => {
        const minimalRequiredActivityPeriod = 1000 // 1 sec
        const isObservingActivity = observeActivityTimeoutIdRef.current !== null

        if (!isObservingActivity) {
            const timeoutId = setTimeout(() => {
                const timeElapsedSinceLatestActivty =
                    Date.now() - timeOfLastestActivityRef.current

                if (
                    timeElapsedSinceLatestActivty <
                        minimalRequiredActivityPeriod &&
                    !isActive
                ) {
                    setIsActive(true)
                }

                observeActivityTimeoutIdRef.current = null
            }, minimalRequiredActivityPeriod)
            observeActivityTimeoutIdRef.current = timeoutId
        }
    }, [isActive])

    const observeActivity = () => {
        // record time of last activity
        timeOfLastestActivityRef.current = Date.now()
        if (isActive) waitForIdle()
        else waitForConstantActivity()
    }

    // invoke the callback whenever the activity state changes
    useEffect(() => {
        if (cb) cb(isActive)

        // ensure to wait for idle state if current state is active
        if (isActive) waitForIdle()
    }, [isActive, cb])

    // run whenever the user state changes
    useEffect(() => {
        if (!isInitialLoadRef.current) {
            observeActivity()
        }
    }, [state])

    useEffect(() => {
        isInitialLoadRef.current = false
    }, [])

    return [state, setState, isActive]
}

function createTypingMessage(listOfTypingUsers) {
    if (listOfTypingUsers.length === 0) return ''
    else if (listOfTypingUsers.length === 1)
        return `${listOfTypingUsers[0]} is typing...`
    else if (listOfTypingUsers.length === 2)
        return `${listOfTypingUsers[0]} & ${listOfTypingUsers[1]} are typing...`
    else return 'multiple users are typing...'
}

export default MessageBox
