package com.etip.SkyExch;

import java.util.Base64; 

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.client.RestTemplate;

@SpringBootApplication
@EnableScheduling
public class SkyExchApp {

	public static void main(String[] args) {
		SpringApplication.run(SkyExchApp.class, args);
	}
	
	@Bean
	public RestTemplate getRestTemplate() {
		return new RestTemplate();
	}

	
	 public static final byte[] EncryptKEY = {'Z', '7', 'E', '?', '>', 'R', 'B', 'A', '|', '}', ']', 'S', 'R', 'G', 'S', '0'};
	 public static final byte[] DecryptKEY = {'P', 'R', 'F', 'H', 'X', '.', '[', 'T', '4', '2', '7', 'O', 'X', ']', '1', '}'};

	    private static Cipher ecipher;
	    private static Cipher dcipher;

	    static {
	        try {
	            ecipher = Cipher.getInstance("AES");
	            SecretKeySpec eSpec = new SecretKeySpec(EncryptKEY, "AES");
	            ecipher.init(Cipher.ENCRYPT_MODE, eSpec);
	        } catch (Exception e) {
	            throw new RuntimeException(e);
	        }


	        try {
	            dcipher = Cipher.getInstance("AES");
	            SecretKeySpec dSpec = new SecretKeySpec(DecryptKEY, "AES");
	            dcipher.init(Cipher.DECRYPT_MODE, dSpec);
	        } catch (Exception e) {
	            throw new RuntimeException(e);
	        }
	    }

	    public static String encrypt(String value) {
	        byte[] b1 = value.getBytes();
	        byte[] encryptedValue;
	        try {
	            encryptedValue = ecipher.doFinal(b1);
	            return Base64.getEncoder().encodeToString(encryptedValue);
	        } catch (Exception e) {
	            throw new IllegalArgumentException(e);
	        }
	    }
	    
	    public static String decrypt(String encryptedValue) {
	        byte[] decryptedValue = Base64.getDecoder().decode(encryptedValue.getBytes());
	        byte[] decValue;
	        try {
	            decValue = dcipher.doFinal(decryptedValue);
	            return new String(decValue);
	        } catch (Exception e) {
	            throw new IllegalArgumentException(e);
	        }
	    }
}
