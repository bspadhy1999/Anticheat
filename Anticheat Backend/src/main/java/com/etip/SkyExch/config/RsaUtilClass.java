package com.etip.SkyExch.config;

import static java.nio.charset.StandardCharsets.UTF_8;

import java.io.File;
import java.io.UnsupportedEncodingException;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.security.InvalidKeyException;
import java.security.KeyFactory;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.SecureRandom;
import java.security.Signature;
import java.security.SignatureException;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

import org.bouncycastle.asn1.ASN1EncodableVector;
import org.bouncycastle.asn1.ASN1Integer;
import org.bouncycastle.asn1.ASN1ObjectIdentifier;
import org.bouncycastle.asn1.ASN1Sequence;
import org.bouncycastle.asn1.DERNull;
import org.bouncycastle.asn1.DEROctetString;
import org.bouncycastle.asn1.DERSequence;
import org.bouncycastle.asn1.pkcs.PKCSObjectIdentifiers;
import org.springframework.stereotype.Component;
import org.springframework.util.ResourceUtils;

@Component
public class RsaUtilClass {
	
	public KeyPair generateKeyPair() throws Exception {
        KeyPairGenerator generator = KeyPairGenerator.getInstance("RSA");
        generator.initialize(1024, new SecureRandom());
        KeyPair pair = generator.generateKeyPair();
        return pair;
    }

    public static String sign(String plainText,PrivateKey privateKey) throws Exception {
        Signature privateSignature = Signature.getInstance("SHA256withRSA");
        privateSignature.initSign(privateKey);
        privateSignature.update(plainText.getBytes(UTF_8));
        byte[] signature = privateSignature.sign();
        return Base64.getEncoder().encodeToString(signature);
    }

    public static boolean verifyDataValidation(String string_to_validate, String signature, PublicKey publicKey) throws Exception{
    	MessageDigest md = MessageDigest.getInstance("SHA-256"); 
        Signature sig = Signature.getInstance("SHA256WithRSA");
        byte[] string_to_validate_bytes = string_to_validate.getBytes(StandardCharsets.UTF_8);
        byte[] signature64 = Base64.getDecoder().decode(signature);
        sig.initVerify(publicKey);
        sig.update(string_to_validate_bytes);
        return sig.verify(signature64);

    }

    public static RSAPublicKey getPublicKey() throws Exception {
    	File file = ResourceUtils.getFile("classpath:static/dreamPublickey");
        byte[] key = Base64.getMimeDecoder().decode(new String(Files.readAllBytes(file.toPath()), Charset.defaultCharset())
                .replace("-----BEGIN PUBLIC KEY-----", "")
                .replaceAll(System.lineSeparator(), "")
                .replace("-----END PUBLIC KEY-----", ""));

        KeyFactory keyFactory = KeyFactory.getInstance("RSA");
        X509EncodedKeySpec keySpec = new X509EncodedKeySpec(key);
        return (RSAPublicKey) keyFactory.generatePublic(keySpec);
    }
    
    public static PublicKey getClientPublicKey(String publickKey) throws Exception {
    String publicKeyPEM = publickKey
            .replace("-----BEGIN PUBLIC KEY-----", "")
            .replaceAll(System.lineSeparator(), "")
            .replace("-----END PUBLIC KEY-----", "");
    byte[] encoded = Base64.getMimeDecoder().decode(publicKeyPEM);
    KeyFactory keyFactory = KeyFactory.getInstance("RSA");
    X509EncodedKeySpec keySpec = new X509EncodedKeySpec(encoded);
    return keyFactory.generatePublic(keySpec);
    }

    public static PrivateKey getPrivateKey(String privateKeyString) throws Exception {
        byte[] encoded = Base64.getDecoder().decode(privateKeyString);
        ASN1EncodableVector v = new ASN1EncodableVector();
        v.add(new ASN1Integer(0));
        ASN1EncodableVector v2 = new ASN1EncodableVector();
        v2.add(new ASN1ObjectIdentifier(PKCSObjectIdentifiers.rsaEncryption.getId()));
        v2.add(DERNull.INSTANCE);
        v.add(new DERSequence(v2));
        v.add(new DEROctetString(encoded));
        ASN1Sequence seq = new DERSequence(v);
        byte[] privKey = seq.getEncoded("DER");
        PKCS8EncodedKeySpec spec = new  PKCS8EncodedKeySpec(privKey);
        KeyFactory fact = KeyFactory.getInstance("RSA");
        PrivateKey privateKey = fact.generatePrivate(spec);
        return privateKey;
    }
    
    public static boolean verifySignature(String message, byte[] signature, PublicKey publicKey) throws InvalidKeyException, SignatureException, UnsupportedEncodingException, NoSuchAlgorithmException {
        byte[] messageByte = message.getBytes();
        Signature signature1 = Signature.getInstance("SHA256withRSA");
        signature1.initVerify(publicKey);
        signature1.update(messageByte);
        return signature1.verify(signature);
    }
 
}
