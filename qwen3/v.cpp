#include <iostream>
#include <vector>
#include <algorithm>
#include <iterator>

int main() {
    // 1. Basic vector creation and initialization
    std::cout << "=== Vector Creation and Initialization ===\n";
    
    // Empty vector
    std::vector<int> vec1;
    
    // Vector with size
    std::vector<int> vec2(5);
    
    // Vector with size and initial value
    std::vector<int> vec3(5, 10);
    
    // Vector from another container
    std::vector<int> vec4{1, 2, 3, 4, 5};
    
    // Vector from array
    int arr[] = {1, 2, 3, 4, 5};
    std::vector<int> vec5(std::begin(arr), std::end(arr));
    
    // Copy constructor
    std::vector<int> vec6(vec4);
    
    // Assignment operator
    std::vector<int> vec7;
    vec7 = vec4;
    
    // 2. Accessing elements
    std::cout << "\n=== Element Access ===\n";
    vec4[0] = 10;        // Subscript access (no bounds checking)
    vec4.at(1) = 20;     // at() with bounds checking
    std::cout << "First element: " << vec4.front() << "\n";  // First element
    std::cout << "Last element: " << vec4.back() << "\n";    // Last element
    
    // 3. Modifying vector contents
    std::cout << "\n=== Modifying Contents ===\n";
    vec1.push_back(1);   // Add element at the end
    vec1.push_back(2);
    vec1.emplace_back(3); // Construct element in place
    
    vec1.pop_back();     // Remove last element
    
    // Insert elements
    vec1.insert(vec1.begin() + 1, 5);        // Insert at position
    vec1.insert(vec1.end(), 2, 7);           // Insert multiple elements
    vec1.insert(vec1.end(), vec4.begin(), vec4.end()); // Insert range
    
    // Erase elements
    vec1.erase(vec1.begin() + 1);            // Remove element at position
    vec1.erase(vec1.begin(), vec1.begin() + 2); // Remove range
    
    // Clear vector
    vec1.clear();
    
    // 4. Vector properties and size
    std::cout << "\n=== Vector Properties ===\n";
    std::vector<int> vec8(10, 5);
    std::cout << "Size: " << vec8.size() << "\n";
    std::cout << "Capacity: " << vec8.capacity() << "\n";
    std::cout << "Max size: " << vec8.max_size() << "\n";
    std::cout << "Empty: " << (vec8.empty() ? "true" : "false") << "\n";
    
    // Reserve and shrink to fit
    vec8.reserve(20);      // Reserve space
    std::cout << "Capacity after reserve: " << vec8.capacity() << "\n";
    vec8.shrink_to_fit();  // Shrink capacity to size
    
    // 5. Iteration
    std::cout << "\n=== Iteration ===\n";
    
    // Range-based for loop
    for (const auto& element : vec4) {
        std::cout << element << " ";
    }
    std::cout << "\n";
    
    // Iterator-based iteration
    for (auto it = vec4.begin(); it != vec4.end(); ++it) {
        std::cout << *it << " ";
    }
    std::cout << "\n";
    
    // Reverse iteration
    for (auto rit = vec4.rbegin(); rit != vec4.rend(); ++rit) {
        std::cout << *rit << " ";
    }
    std::cout << "\n";
    
    // 6. Algorithms with vectors
    std::cout << "\n=== Algorithms ===\n";
    std::vector<int> vec9{3, 1, 4, 1, 5, 9, 2, 6};
    
    // Sort
    std::sort(vec9.begin(), vec9.end());
    for (const auto& element : vec9) {
        std::cout << element << " ";
    }
    std::cout << "\n";
    
    // Find
    auto found = std::find(vec9.begin(), vec9.end(), 5);
    if (found != vec9.end()) {
        std::cout << "Found 5 at position: " << std::distance(vec9.begin(), found) << "\n";
    }
    
    // Count
    int count = std::count(vec9.begin(), vec9.end(), 1);
    std::cout << "Count of 1: " << count << "\n";
    
    // Reverse
    std::reverse(vec9.begin(), vec9.end());
    for (const auto& element : vec9) {
        std::cout << element << " ";
    }
    std::cout << "\n";
    
    // 7. Vector operations
    std::cout << "\n=== Vector Operations ===\n";
    std::vector<int> vec10{1, 2, 3};
    std::vector<int> vec11{4, 5, 6};
    
    // Swap
    vec10.swap(vec11);
    std::cout << "After swap:\n";
    for (const auto& element : vec10) {
        std::cout << element << " ";
    }
    std::cout << "\n";
    
    // Assignment from initializer list
    vec10 = {7, 8, 9};
    for (const auto& element : vec10) {
        std::cout << element << " ";
    }
    std::cout << "\n";
    
    // Vector of vectors
    std::vector<std::vector<int>> matrix(3, std::vector<int>(4, 0));
    matrix[0][0] = 1;
    std::cout << "Matrix[0][0]: " << matrix[0][0] << "\n";
    
    // 8. Vector with custom objects
    std::cout << "\n=== Custom Objects ===\n";
    struct Person {
        std::string name;
        int age;
        
        Person(const std::string& n, int a) : name(n), age(a) {}
    };
    
    std::vector<Person> people;
    people.emplace_back("Alice", 30);
    people.push_back(Person("Bob", 25));
    
    for (const auto& person : people) {
        std::cout << person.name << " is " << person.age << " years old\n";
    }
    
    return 0;
}