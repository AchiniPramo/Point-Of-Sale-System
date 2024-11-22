function generateNextID(prevID) {
    // Extract the numeric part of the ID
    const numericPart = parseInt(prevID.replace(/\D/g, ''));

    // Increment the numeric part
    const nextNumericPart = numericPart + 1;

    // Pad the numeric part with leading zeros if necessary
    const nextNumericPartStr = nextNumericPart.toString().padStart(prevID.length - 1, '0');

    // Construct the next ID by combining the prefix and the new numeric part
    const prefix = prevID.replace(/\d/g, '');
    const nextID = prefix + nextNumericPartStr;

    return nextID;
  }