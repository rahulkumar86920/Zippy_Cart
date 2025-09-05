import React, { useEffect } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signupStyles } from '../assets/dummyStyles'
import { Link } from 'react-router-dom'
import { FaArrowCircleLeft, FaCheck, FaEnvelope, FaEye, FaEyeSlash, FaLock, FaUser } from 'react-icons/fa'

const Signup = () => {

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        remember: true,
    })

    const [showPassword, setShowPassword] = useState(false)

    const [showToast, setShowToast] = useState(false)
    const [errors, setErrors] = useState({})
    const Navigate = useNavigate();

    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => {
                setShowToast(false)
                Navigate("/login")
            }, 2000)
            return () => clearTimeout(timer)
        }
    }, [showToast, Navigate]
    )

    // form handler 
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checked' ? checked : value
        }))
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: " " }))
        }
    }
    //  from validation id the user has entered the required field or not 
    function validate() {
        const newErrors = {}
        if (!formData.name.trim()) newErrors.name = 'Name is required'
        if (!formData.email.trim()) newErrors.email = 'Email is required'
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format'
        if (!formData.password) newErrors.password = 'Password is required'

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }


    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            setShowToast(true)
        }
    }

    const togglePasswordVisibility = (field) => {
        setShowPassword(prev => ({
            ...prev,
            [field]: !prev[field]
        }))
    }

    return (
        <div className={signupStyles.page}>
            {/* this is for the arrow to button to back to login page */}
            <Link to="/login" className={signupStyles.backLink}>
                <FaArrowCircleLeft className='mr-2' />
                Back to Login
            </Link>

            {
                showToast && (
                    <div className={signupStyles.toast}>
                        <FaCheck className='mr-2' />
                        Account created successfully :)
                    </div>
                )
            }


            {/* signUp Card */}
            <div className={signupStyles.signupCard}>
                <div className={signupStyles.logoContainer}>
                    <div className={signupStyles.logoOuter}>
                        <div className={signupStyles.logoInner}>
                            <FaUser className={signupStyles.logoIcon} />
                        </div>
                    </div>
                </div>
                <h2 className={signupStyles.title}>
                    Create Account
                </h2>

                {/* form to accept the user information  */}
                <form onSubmit={handleSubmit} className={signupStyles.form}>

                    <div className={signupStyles.inputContainer}>
                        <FaUser className={signupStyles.inputIcon} />
                        <input type="text" name='name' value={formData.name} onChange={handleChange}
                            placeholder='Enter Your Full Name' required className={signupStyles.input} />
                        {errors.name && <p className={signupStyles.error}>{errors.name}</p>}
                    </div>

                    <div className={signupStyles.inputContainer}>
                        <FaEnvelope className={signupStyles.inputIcon} />
                        <input type="email" name='email' value={formData.email} onChange={handleChange}
                            placeholder='Enter Your Email Address' required className={signupStyles.input} />
                        {errors.email && <p className={signupStyles.error}>{errors.email}</p>}
                    </div>

                    <div className={signupStyles.inputContainer}>
                        <FaLock className={signupStyles.inputIcon} />
                        <input type={showPassword.password ? "text" : "password"} name='password' value={formData.password} onChange={handleChange}
                            placeholder='Enter Password' required className={signupStyles.passwordInput} />

                        {/* this is for the password hide hide and see */}
                        <button type='button' onClick={() => togglePasswordVisibility("password")}
                            className={signupStyles.toggleButton}
                            aria-label={showPassword.password ? "hide password " : "show password"}>
                            {
                                showPassword ? <FaEyeSlash /> : <FaEye />
                            }
                        </button>

                        {errors.password && <p className={signupStyles.error}>{errors.password}</p>}
                    </div>

                    {/* terms and condition */}
                    <div className={signupStyles.termsContainer}>
                        <label className={signupStyles.termsLabel}>
                            <input type="checkbox" name='remember' checked={formData.remember}
                                onChange={handleChange} className={signupStyles.termsCheckbox}
                                required />
                            I agree to the terms and contiotions
                        </label>
                    </div>

                    <button type='submit' className={signupStyles.submitButton}>
                        Sign Up
                    </button>
                </form>

                <p className={signupStyles.signinText}>
                    Already have an account? {" "}
                    <Link to="/login" className={signupStyles.signinLink}>
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Signup