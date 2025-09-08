import React, { useState } from "react";
import contactStyles from "./../assets/dummyStyles";
import { FaCheck, FaComment, FaEnvelope, FaPagelines, FaPaperPlane, FaPhone, FaTag, FaUser } from "react-icons/fa";

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    });
    const [showToast, setShowToast] = useState(false);

    const whatsappNumber = "8291651134";

    const handleChangne = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // web Api whatsapp

    const handleSubmit = (e) => {
        e.preventDefault();
        const { name, email, phone, subject, message } = formData;
        if (!name || !email || !phone || !subject || !message) {
            alert("Please fill all fields");
            return;
        }
        // Build WhatsApp message
        const text =
            `Name: ${name}\n` +
            `Email: ${email}\n` +
            `Phone: ${phone}\n` +
            `Subject: ${subject}\n` +
            `Message: ${message}`;

        // Open WhatsApp Web with pre-filled message
        const url = `https://web.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(
            text
        )}`;
        window.open(url, "_blank");

        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
        setFormData({
            name: "",
            email: "",
            phone: "",
            subject: "",
            message: "",
        });
    };

    return (
        <div className={contactStyles.pageContainer}>
            {showToast && (
                <div className="toast-notification">
                    <div className={contactStyles.toast}>
                        <FaCheck className="mr-2" />
                        Message opened in Whatsapp
                    </div>
                </div>
            )}

            {/* Center Notifications */}
            <div className={contactStyles.centeredContainer}>
                <div className={contactStyles.headingContainer}>
                    <h1 className={contactStyles.heading}>Contact ZippyCart</h1>
                    <div className={contactStyles.divider} />
                </div>
                <br />

                {/* contact area */}

                <div className={contactStyles.contactFormContainer}>
                    <div className="absolute insert-0 bg-emerald-900 bg-opacity-90 backdrop-blur-sm z-0"></div>
                    <form onSubmit={handleSubmit} className={contactStyles.form}>
                        {/* name */}
                        <div className={contactStyles.formField}>
                            <div className={contactStyles.inputContainer}>
                                <div className={contactStyles.inputIconContainer}>
                                    <FaUser className={contactStyles.inputIcon} />
                                </div>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChangne}
                                    className={contactStyles.formInput}
                                    placeholder="Rahul Sah"
                                    required
                                />
                            </div>
                        </div>

                        {/* email */}
                        <div className={contactStyles.formField}>
                            <div className={contactStyles.inputContainer}>
                                <div className={contactStyles.inputIconContainer}>
                                    <FaEnvelope className={contactStyles.inputIcon} />
                                </div>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChangne}
                                    className={contactStyles.formInput}
                                    placeholder="rahul@gmail.com"
                                    required
                                />
                            </div>
                        </div>

                        {/* phone*/}
                        <div className={contactStyles.formField}>
                            <div className={contactStyles.inputContainer}>
                                <div className={contactStyles.inputIconContainer}>
                                    <FaPhone className={contactStyles.inputIcon} />
                                </div>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChangne}
                                    className={contactStyles.formInput}
                                    placeholder="8291651134"
                                    required
                                />
                            </div>
                        </div>

                        {/*subject*/}
                        <div className={contactStyles.formField}>
                            <div className={contactStyles.inputContainer}>
                                <div className={contactStyles.inputIconContainer}>
                                    <FaTag className={contactStyles.inputIcon} />
                                </div>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChangne}
                                    className={contactStyles.formInput}
                                    placeholder="Order Inquery"
                                    required
                                />
                            </div>
                        </div>

                        {/* message*/}
                        <div className={contactStyles.formField}>
                            <div className={contactStyles.inputContainer}>
                                <div className={contactStyles.inputIconContainer} >
                                    <FaComment className="h-5 w-5 text-emerald-400" />
                                </div>
                                <textarea name="message" id=" message" rows={5} value={formData.message}
                                    onChange={handleChangne} className={contactStyles.formTextarea}
                                    placeholder="Type your message here :)" required>
                                </textarea>

                            </div>
                        </div>

                        {/* submit button */}
                        <button type="submit" className={contactStyles.submitButton}>
                            <FaPaperPlane className="h-5 w-5 text-black mr-3" />
                            <span className={contactStyles.submitButtonText}>
                                Send Message
                            </span>

                        </button>

                    </form>
                </div>
            </div>
            <style>{contactStyles.customCSS}</style>
        </div>
    );
};

export default ContactUs;
