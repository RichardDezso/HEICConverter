#!/usr/bin/env python3
"""
Script to set a new admin password with secure hashing
Usage: python set_admin_password.py
"""
import getpass
from passlib.hash import bcrypt

def set_password():
    print("=" * 60)
    print("Set New Admin Password")
    print("=" * 60)
    
    while True:
        password = getpass.getpass("Enter new admin password: ")
        
        if len(password) < 8:
            print("❌ Password must be at least 8 characters long!")
            continue
        
        confirm = getpass.getpass("Confirm password: ")
        
        if password != confirm:
            print("❌ Passwords don't match! Try again.")
            continue
        
        # Hash the password
        hashed = bcrypt.hash(password)
        
        # Save to file
        with open('/app/backend/.admin_password', 'w') as f:
            f.write(hashed)
        
        print("\n✅ Password updated successfully!")
        print("🔒 Password is now securely hashed")
        print("\nYou can now login to /admin with your new password.")
        break

if __name__ == "__main__":
    set_password()
