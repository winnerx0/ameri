package com.winnerx0.ameri.service.impl;

import com.winnerx0.ameri.model.Otp;
import com.winnerx0.ameri.model.User;
import com.winnerx0.ameri.repository.UserRepository;
import com.winnerx0.ameri.service.EmailService;
import com.winnerx0.ameri.service.OtpService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.persistence.EntityNotFoundException;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;

@Service
@Slf4j
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender javaMailSender;
    private final OtpService otpService;
    private final UserRepository userRepository;

    public EmailServiceImpl(JavaMailSender javaMailSender,  OtpService otpService, UserRepository userRepository) {
        this.javaMailSender = javaMailSender;
        this.otpService = otpService;
        this.userRepository = userRepository;
    }

    @Async
    @Retryable(retryFor = MessagingException.class, maxAttempts = 5, backoff = @Backoff(delay = 5000))
    @Override
    public void sendMail(String to, String subject, String message) {
        try {
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper helper =
                    new MimeMessageHelper(mimeMessage, "utf-8");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(message);
            javaMailSender.send(mimeMessage);
        } catch (MessagingException e) {
            log.error("failed to send email", e);
            throw new IllegalStateException("Failed to send email");
        }
    }

    @Override
    public void sendVerificationToken(String email) {

        User user = userRepository.findByEmail(email).orElseThrow(() -> new EntityNotFoundException("User not found"));

        log.info("enabled {}", user.isEnabled());
        if(user.isEnabled()){
            throw new IllegalStateException("Account already verified");
        }

        if(user.getOtp() != null && user.getOtp().getExpiresAt().isAfter(LocalDateTime.now().minusMinutes(5))) {
            throw new IllegalStateException("Please wait 5 minutes before requesting for another OTP");
        }

        Integer token = otpService.generateToken();

        Otp otp = new Otp();
        otp.setOtp(token);
        otp.setExpiresAt(LocalDateTime.now().plusMinutes(10));

        user.setOtp(otp);

        userRepository.save(user);

        sendMail(email, "Verify your Ameri account", String.format("Thank you for signing up to Ameri please verify your account using the OTP %d", token));

    }
}