def find_max(numbers):
    if not numbers:
        return None
    max_value = numbers[0]
    for num in numbers:
        if num > max_value:
            max_value = num
    return max_value

def average(nums):
    if not nums:
        return None
    return sum(nums) / len(nums)

def classify_even_odd(numbers):
    result = {
        'even': [],
        'odd': []
    }
    for num in numbers:
        if num % 2 == 0:
            result['even'].append(num)
        else:
            result['odd'].append(num)
    return result

def count_words(text):
    words = text.split()
    return len(words)

def reverse_string(s):
    return s[::-1]

def is_palindrome(s):
    # Remove spaces and convert to lowercase
    s = s.lower().replace(" ", "")
    return s == s[::-1]

def factorial(n):
    if n == 0 or n == 1:
        return 1
    result = 1
    for i in range(2, n + 1):
        result *= i
    return result

def fibonacci(n):
    if n <= 0:
        return []
    if n == 1:
        return [0]
    if n == 2:
        return [0, 1]
    
    fib = [0, 1]
    for i in range(2, n):
        fib.append(fib[i-1] + fib[i-2])
    return fib

def filter_strings(strings, min_length):
    return [s for s in strings if len(s) >= min_length]

def merge_dicts(dict1, dict2):
    result = dict1.copy()
    result.update(dict2)
    return result

# Test the functions
if __name__ == "__main__":
    # Test find_max
    print("Testing find_max:")
    print(find_max([5, 9, 3, 7, 2, 8]))  # Should print 9
    print(find_max([-5, -9, -3, -7, -2, -8]))  # Should print -2
    print(find_max([]))  # Should print None
    
    # Test average
    print("\nTesting average:")
    print(average([5, 9, 3, 7, 2, 8]))  # Should print 5.666...
    print(average([]))  # Should print None
    
    # Test classify_even_odd
    print("\nTesting classify_even_odd:")
    print(classify_even_odd([5, 9, 3, 7, 2, 8]))  # Should print {'even': [2, 8], 'odd': [5, 9, 3, 7]}
    
    # Test count_words
    print("\nTesting count_words:")
    print(count_words("Hello world, how are you?"))  # Should print 5
    
    # Test reverse_string
    print("\nTesting reverse_string:")
    print(reverse_string("Hello world"))  # Should print "dlrow olleH"
    
    # Test is_palindrome
    print("\nTesting is_palindrome:")
    print(is_palindrome("racecar"))  # Should print True
    print(is_palindrome("A man a plan a canal Panama"))  # Should print True
    print(is_palindrome("hello"))  # Should print False
    
    # Test factorial
    print("\nTesting factorial:")
    print(factorial(5))  # Should print 120
    print(factorial(0))  # Should print 1
    
    # Test fibonacci
    print("\nTesting fibonacci:")
    print(fibonacci(8))  # Should print [0, 1, 1, 2, 3, 5, 8, 13]
    
    # Test filter_strings
    print("\nTesting filter_strings:")
    print(filter_strings(["apple", "banana", "kiwi", "orange", "pear"], 5))  # Should print ["apple", "banana", "orange"]
    
    # Test merge_dicts
    print("\nTesting merge_dicts:")
    print(merge_dicts({"a": 1, "b": 2}, {"c": 3, "d": 4}))  # Should print {"a": 1, "b": 2, "c": 3, "d": 4}
